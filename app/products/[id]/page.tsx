// app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProductById } from "../data";
import ProductDetailClient from "./product-detail-client";

type Params = { id: string };
type PageProps = { params: Params | Promise<Params> };

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params; 

  const product = getProductById(id);
  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
