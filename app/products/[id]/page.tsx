"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import ProductDetail from "./product-detail-client";

type Product = {
  id: string;
  title: string;
  orgName: string;
  category?: string;
  price: number;
  imageUrl?: string;
  description: string;
  features: string[];
  aboutOrg: string;
  sizes?: string[];
};

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const base = (p: Partial<Product>): Product => ({
  id: p.id ?? "unknown",
  title: p.title ?? "Sample Product",
  orgName: p.orgName ?? "VSU",
  category: p.category ?? "Clothing",
  price: p.price ?? 450,
  imageUrl: p.imageUrl ?? "", // if empty, your ProductDetail shows “No image available”
  description:
    p.description ??
    "High-quality product with the official design. Perfect for everyday wear or representing your college pride.",
  features:
    p.features ?? ["Premium fabric", "Official design", "Available in multiple sizes"],
  aboutOrg:
    p.aboutOrg ??
    "Official merchandise. All proceeds support student activities and organization initiatives.",
  sizes: p.sizes ?? DEFAULT_SIZES,
});

const PRODUCTS: Record<string, Product> = {
  // Faculty of Engineering (3)
  "eng-product1": base({
    id: "eng-product1",
    title: "Sample Product 1",
    orgName: "Faculty of Engineering",
    price: 450,
    imageUrl: "/products/eng-product1.jpg", // ✅ make sure this file exists in public/products/
  }),
  "eng-product2": base({
    id: "eng-product2",
    title: "Sample Product 2",
    orgName: "Faculty of Engineering",
    price: 450,
    imageUrl: "/products/eng-product2.jpg",
  }),
  "eng-product3": base({
    id: "eng-product3",
    title: "Sample Product 3",
    orgName: "Faculty of Engineering",
    price: 450,
    imageUrl: "/products/eng-product3.jpg",
  }),

  // Faculty of Computing (3)
  "comp-product1": base({
    id: "comp-product1",
    title: "Sample Product 1",
    orgName: "Faculty of Computing",
    price: 450,
    imageUrl: "/products/comp-product1.jpg",
  }),
  "comp-product2": base({
    id: "comp-product2",
    title: "Sample Product 2",
    orgName: "Faculty of Computing",
    price: 450,
    imageUrl: "/products/comp-product2.jpg",
  }),
  "comp-product3": base({
    id: "comp-product3",
    title: "Sample Product 3",
    orgName: "Faculty of Computing",
    price: 450,
    imageUrl: "/products/comp-product3.jpg",
  }),

  // Faculty of Education (3)
  "edu-product1": base({
    id: "edu-product1",
    title: "Sample Product 1",
    orgName: "Faculty of Education",
    price: 450,
    imageUrl: "/products/edu-product1.jpg",
  }),
  "edu-product2": base({
    id: "edu-product2",
    title: "Sample Product 2",
    orgName: "Faculty of Education",
    price: 450,
    imageUrl: "/products/edu-product2.jpg",
  }),
  "edu-product3": base({
    id: "edu-product3",
    title: "Sample Product 3",
    orgName: "Faculty of Education",
    price: 450,
    imageUrl: "/products/edu-product3.jpg",
  }),
};

export default function ProductPage() {
  const params = useParams();

  const raw = params?.id;
  const id = useMemo(() => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return decodeURIComponent((v ?? "").toString()).trim();
  }, [raw]);

  const product = useMemo(() => {
    if (!id) return null;

    if (PRODUCTS[id]) return PRODUCTS[id];

    // case-insensitive match
    const lower = id.toLowerCase();
    const hitKey = Object.keys(PRODUCTS).find((k) => k.toLowerCase() === lower);
    return hitKey ? PRODUCTS[hitKey] : null;
  }, [id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-lg font-bold">Product not found</h1>
        <p className="text-sm text-gray-600">
          No product data for: {id || "(missing id)"}
        </p>
      </div>
    );
  }

  // normalize sizes so ProductDetail never crashes
  const normalized: Product = {
    ...product,
    sizes: product.sizes && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES,
  };

  return <ProductDetail product={normalized} />;
}
