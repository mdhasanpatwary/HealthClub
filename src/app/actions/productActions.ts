"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { unstable_cache } from "next/cache";
import { ProductItem, PRODUCTS_CACHE_TAG } from "@/lib/validations/product";

function mapProductRow(p: {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  price: number;
  regularPrice: number | null;
  discountBadge: string | null;
  category: string;
  categoryBn: string | null;
  descriptionBn: string;
  descriptionEn: string | null;
  featuresBn: unknown;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}): ProductItem {
  let features: string[] | null = null;
  if (Array.isArray(p.featuresBn)) {
    features = p.featuresBn.map((f) => String(f));
  } else if (typeof p.featuresBn === "string") {
    try {
      const parsed = JSON.parse(p.featuresBn);
      if (Array.isArray(parsed)) features = parsed.map(String);
    } catch {
      features = null;
    }
  }

  return {
    id: p.id,
    slug: p.slug,
    nameBn: p.nameBn,
    nameEn: p.nameEn,
    price: p.price,
    regularPrice: p.regularPrice,
    discountBadge: p.discountBadge,
    category: p.category,
    categoryBn: p.categoryBn,
    descriptionBn: p.descriptionBn,
    descriptionEn: p.descriptionEn,
    featuresBn: features,
    imageUrl: p.imageUrl,
    inStock: p.inStock,
    featured: p.featured,
    order: p.order,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

const fetchCachedProducts = unstable_cache(
  async () => {
    try {
      const rows = await prisma.product.findMany({
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      });
      return rows.map(mapProductRow);
    } catch (error) {
      logger.error("Failed to fetch products from database:", error);
      return [];
    }
  },
  ["all-shop-products-v3"],
  {
    revalidate: false,
    tags: [PRODUCTS_CACHE_TAG],
  }
);

const fetchCachedProductBySlug = unstable_cache(
  async (itemSlug: string) => {
    try {
      const row = await prisma.product.findUnique({
        where: { slug: itemSlug },
      });
      if (!row) return null;
      return mapProductRow(row);
    } catch (error) {
      logger.error(`Failed to fetch product with slug ${itemSlug}:`, error);
      return null;
    }
  },
  ["shop-product-by-slug-v3"],
  {
    revalidate: false,
    tags: [PRODUCTS_CACHE_TAG],
  }
);

/**
 * Fetch all active products with optional category and search filters
 */
export async function getProductsAction(options?: {
  category?: string;
  query?: string;
  inStockOnly?: boolean;
}): Promise<ProductItem[]> {
  let products = await fetchCachedProducts();

  if (options?.category && options.category !== "all") {
    products = products.filter((p) => p.category === options.category);
  }

  if (options?.inStockOnly) {
    products = products.filter((p) => p.inStock);
  }

  if (options?.query && options.query.trim()) {
    const q = options.query.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.nameBn.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.descriptionBn.toLowerCase().includes(q)
    );
  }

  return products;
}

/**
 * Fetch a single product by its unique slug
 */
export async function getProductBySlugAction(slug: string): Promise<ProductItem | null> {
  if (!slug) return null;
  return fetchCachedProductBySlug(slug.trim().toLowerCase());
}

/**
 * Fetch all product slugs for static params generation and sitemap
 */
export async function getAllProductSlugsAction(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const rows = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      slug: r.slug,
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    logger.error("Failed to fetch product slugs:", error);
    return [];
  }
}
