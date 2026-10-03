"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { hasAdminPermission } from "@/lib/permissions";
import { updateTag, revalidateTag, revalidatePath } from "next/cache";
import {
  productSchema,
  ProductFormValues,
  ProductItem,
  PRODUCTS_CACHE_TAG,
} from "@/lib/validations/product";

async function verifyProductAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_products");
}

function revalidateProductCaches(slug?: string) {
  try {
    updateTag(PRODUCTS_CACHE_TAG);
    if (slug) {
      updateTag(`shop-product-${slug}`);
    }
    revalidateTag(PRODUCTS_CACHE_TAG, "max");
  } catch (e) {
    logger.warn("Cache tag update error:", e);
  }
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  if (slug) {
    revalidatePath(`/shop/${slug}`);
  }
}

/**
 * Fetch all products for admin dashboard (un-cached for instant updates)
 */
export async function getAdminProductsAction(): Promise<ProductItem[]> {
  const isAdmin = await verifyProductAdmin();
  if (!isAdmin) {
    throw new Error("অননুমোদিত অ্যাক্সেস। আপনার প্রোডাক্ট ম্যানেজমেন্টের অনুমতি নেই।");
  }

  try {
    const rows = await prisma.product.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return rows.map((p) => {
      let features: string[] | null = null;
      if (Array.isArray(p.featuresBn)) {
        features = p.featuresBn.map((f) => String(f));
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
    });
  } catch (error) {
    logger.error("Failed to fetch admin products:", error);
    return [];
  }
}

/**
 * Create a new product
 */
export async function createProductAction(
  data: ProductFormValues
): Promise<{ success: boolean; error?: string; product?: ProductItem }> {
  const isAdmin = await verifyProductAdmin();
  if (!isAdmin) {
    return { success: false, error: "আপনার প্রোডাক্ট যুক্ত করার অনুমতি নেই।" };
  }

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "তথ্য সঠিক নয়।" };
  }

  const valid = parsed.data;

  try {
    // Check if slug is unique
    const existing = await prisma.product.findUnique({
      where: { slug: valid.slug },
    });
    if (existing) {
      return { success: false, error: "এই স্লাগ দিয়ে ইতিমধ্যে একটি প্রোডাক্ট রয়েছে। ভিন্ন স্লাগ ব্যবহার করুন।" };
    }

    const created = await prisma.product.create({
      data: {
        slug: valid.slug,
        nameBn: valid.nameBn,
        nameEn: valid.nameEn,
        price: valid.price,
        regularPrice: valid.regularPrice || null,
        discountBadge: valid.discountBadge || null,
        category: valid.category,
        categoryBn: valid.categoryBn || null,
        descriptionBn: valid.descriptionBn,
        descriptionEn: valid.descriptionEn || null,
        featuresBn: valid.featuresBn || [],
        imageUrl: valid.imageUrl,
        inStock: valid.inStock,
        featured: valid.featured,
        order: valid.order,
      },
    });

    revalidateProductCaches(created.slug);

    return {
      success: true,
      product: {
        id: created.id,
        slug: created.slug,
        nameBn: created.nameBn,
        nameEn: created.nameEn,
        price: created.price,
        regularPrice: created.regularPrice,
        discountBadge: created.discountBadge,
        category: created.category,
        categoryBn: created.categoryBn,
        descriptionBn: created.descriptionBn,
        descriptionEn: created.descriptionEn,
        featuresBn: Array.isArray(created.featuresBn) ? created.featuresBn.map(String) : null,
        imageUrl: created.imageUrl,
        inStock: created.inStock,
        featured: created.featured,
        order: created.order,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    logger.error("Failed to create product:", error);
    return { success: false, error: "প্রোডাক্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" };
  }
}

/**
 * Update an existing product
 */
export async function updateProductAction(
  id: string,
  data: ProductFormValues
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = await verifyProductAdmin();
  if (!isAdmin) {
    return { success: false, error: "আপনার প্রোডাক্ট সম্পাদনা করার অনুমতি নেই।" };
  }

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "তথ্য সঠিক নয়।" };
  }

  const valid = parsed.data;

  try {
    // Check if slug taken by another product
    const existing = await prisma.product.findFirst({
      where: {
        slug: valid.slug,
        NOT: { id },
      },
    });
    if (existing) {
      return { success: false, error: "এই স্লাগ দিয়ে অন্য একটি প্রোডাক্ট ইতিমধ্যে বিদ্যমান।" };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        slug: valid.slug,
        nameBn: valid.nameBn,
        nameEn: valid.nameEn,
        price: valid.price,
        regularPrice: valid.regularPrice || null,
        discountBadge: valid.discountBadge || null,
        category: valid.category,
        categoryBn: valid.categoryBn || null,
        descriptionBn: valid.descriptionBn,
        descriptionEn: valid.descriptionEn || null,
        featuresBn: valid.featuresBn || [],
        imageUrl: valid.imageUrl,
        inStock: valid.inStock,
        featured: valid.featured,
        order: valid.order,
      },
    });

    revalidateProductCaches(updated.slug);
    return { success: true };
  } catch (error) {
    logger.error("Failed to update product:", error);
    return { success: false, error: "প্রোডাক্ট আপডেট করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Delete a product
 */
export async function deleteProductAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = await verifyProductAdmin();
  if (!isAdmin) {
    return { success: false, error: "আপনার প্রোডাক্ট মুছে ফেলার অনুমতি নেই।" };
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });

    await prisma.product.delete({
      where: { id },
    });

    revalidateProductCaches(existing?.slug);
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete product:", error);
    return { success: false, error: "প্রোডাক্ট মুছে ফেলা সম্ভব হয়নি।" };
  }
}

/**
 * Toggle product inStock status
 */
export async function toggleProductStockAction(
  id: string,
  inStock: boolean
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = await verifyProductAdmin();
  if (!isAdmin) {
    return { success: false, error: "অনুমতি নেই।" };
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: { inStock },
      select: { slug: true },
    });

    revalidateProductCaches(updated.slug);
    return { success: true };
  } catch (error) {
    logger.error("Failed to toggle product stock:", error);
    return { success: false, error: "স্টক স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।" };
  }
}
