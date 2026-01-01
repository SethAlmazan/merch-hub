"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useCart } from "./CartProvider";
import type { CartItem } from "@/lib/cart/types";

function money(n: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
}

export default function CartItemRow({ item }: { item: CartItem }) {
  const { inc, dec, removeItem } = useCart();

  const imageSrc = useMemo(() => {
    const v = typeof item.imageUrl === "string" ? item.imageUrl.trim() : "";
    return v; // may be ""
  }, [item.imageUrl]);

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white p-3">
      {/* Image */}
      <div className="h-14 w-14 overflow-hidden rounded-lg border bg-gray-50 flex items-center justify-center">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={item.title}
            width={56}
            height={56}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="text-[10px] text-gray-500 text-center px-1 leading-tight">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="text-sm font-semibold leading-tight">{item.title}</div>
        <div className="text-[11px] text-gray-500">
          {item.orgName ?? ""}
          {item.variant ? (item.orgName ? ` • ${item.variant}` : item.variant) : ""}
        </div>
      </div>

      {/* Qty */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dec(item.id)}
          className="h-7 w-7 rounded-md border bg-white text-sm hover:bg-gray-50"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <div className="min-w-[18px] text-center text-sm font-semibold">{item.qty}</div>
        <button
          onClick={() => inc(item.id)}
          className="h-7 w-7 rounded-md border bg-white text-sm hover:bg-gray-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Price */}
      <div className="w-24 text-right text-sm font-semibold">
        {money(item.price * item.qty)}
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="ml-1 rounded-md p-2 text-red-500 hover:bg-red-50"
        aria-label="Remove item"
        title="Remove"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 6h18M9 6V4h6v2m-7 4v10m4-10v10m4-10v10M6 6l1 16h10l1-16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
