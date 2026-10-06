import type { Metadata } from "next";
import { AdminProductsClient } from "./components/AdminProductsClient";
import { getAdminProductsAction } from "@/app/actions/productAdminActions";

export const metadata: Metadata = {
  title: "প্রোডাক্ট শপ ম্যানেজমেন্ট | Admin Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProductsPage() {
  const products = await getAdminProductsAction();

  return (
    <div className="space-y-6">
      <AdminProductsClient initialProducts={products} />
    </div>
  );
}
