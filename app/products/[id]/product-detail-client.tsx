"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

type Product = {
  id: string;
  title: string;
  orgName: string;
  category?: string;
  price: number;
  imageUrl?: string; // ✅ make optional
  description: string;
  features: string[];
  aboutOrg: string;
  sizes?: string[];
};

const FALLBACK_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const sizes = useMemo(() => {
    const list = product.sizes;
    return Array.isArray(list) && list.length > 0 ? list : FALLBACK_SIZES;
  }, [product.sizes]);

  const imageSrc = useMemo(() => {
    const v = typeof product.imageUrl === "string" ? product.imageUrl.trim() : "";
    return v; // can be "" (we’ll guard render)
  }, [product.imageUrl]);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  const handlePurchase = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    const cartId = `${product.id}-${selectedSize}`;

    addItem(
      {
        id: cartId,
        title: product.title,
        orgName: product.orgName,
        imageUrl: imageSrc || "/placeholder.png", // ✅ stored in cart (fallback ok)
        price: product.price,
        variant: `Size: ${selectedSize}`,
      },
      qty
    );

    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4">
        <button
          onClick={() => router.push("/products")}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to products
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Image */}
        <div className="rounded-2xl border bg-white p-4">
          <div className="overflow-hidden rounded-xl bg-gray-50">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.title}
                width={900}
                height={900}
                className="h-auto w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-105 items-center justify-center text-sm text-gray-500">
                No image available (imageUrl is empty)
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-xs text-gray-500">{product.orgName}</div>
          <h1 className="mt-1 text-xl font-bold">{product.title}</h1>
          {product.category ? <div className="text-sm text-gray-500">{product.category}</div> : null}

          <div className="mt-4 text-lg font-bold text-indigo-700">
            ₱{product.price.toFixed(2)}
          </div>

          {/* Size */}
          <div className="mt-5">
            <div className="text-sm font-semibold">Size</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((s) => {
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={[
                      "rounded-md border px-3 py-1 text-xs font-semibold",
                      active ? "bg-black text-white" : "bg-white hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Purchase */}
          <div className="mt-5 flex items-center gap-4">
            <div>
              <div className="text-sm font-semibold">Quantity</div>
              <div className="mt-2 flex items-center gap-2 rounded-lg border bg-gray-50 px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 rounded-md hover:bg-white"
                >
                  −
                </button>
                <div className="w-8 text-center text-sm font-semibold">{qty}</div>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="h-8 w-8 rounded-md hover:bg-white"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePurchase}
              className="mt-6 flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-900"
            >
              Purchase
            </button>
          </div>

          {/* Info cards */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs font-bold">Description</div>
              <p className="mt-2 text-xs text-gray-600">{product.description}</p>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs font-bold">Features</div>
              <ul className="mt-2 list-disc pl-4 text-xs text-gray-600 space-y-1">
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs font-bold">About {product.orgName}</div>
              <p className="mt-2 text-xs text-gray-600">{product.aboutOrg}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
