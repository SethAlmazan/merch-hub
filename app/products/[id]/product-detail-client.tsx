"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import NavbarUserMenu from "@/components/NavbarUserMenu";
import type { Product } from "../data";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export default function ProductDetailClient({ product }: { product: Product }) {
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");
  const [qty, setQty] = useState(1);

  const priceText = useMemo(
    () => `₱${product.price.toFixed(2)}`,
    [product.price]
  );

  return (
    <main className="min-h-screen bg-white">
      {/* NAVBAR (same as home) */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/vsu-logo.png"
              alt="VSU Logo"
              width={60}
              height={60}
              className="h-15 w-15 rounded-full object-cover"
            />
            <span className="text-sm md:text-lg font-semibold">
              VSU MERCH HUB
            </span>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <input
              type="text"
              placeholder="Search merchandise"
              className="w-full max-w-xl rounded-full border px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden text-sm md:inline">Help</button>

            <button className="relative rounded-full border p-2 hover:bg-gray-100">
              <span className="text-lg">🛒</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                0
              </span>
            </button>

            <NavbarUserMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link href="/#products" className="text-sm text-gray-600 hover:underline">
          ← Back to products
        </Link>

        {/* Top section */}
        <div className="mt-4 grid gap-6 md:grid-cols-[420px_1fr]">
          {/* Image */}
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
              {product.college}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {product.title}
              </h1>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>

            <div className="text-xl font-semibold text-indigo-600">
              {priceText}
            </div>

            {/* Size */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={[
                      "rounded-md border px-3 py-1 text-xs",
                      size === s
                        ? "border-black bg-black text-white"
                        : "bg-white hover:bg-gray-50",
                    ].join(" ")}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Purchase */}
            <div className="grid gap-3 sm:grid-cols-[160px_1fr] sm:items-end">
              <div className="space-y-2">
                <p className="text-sm font-medium">Quantity</p>
                <div className="inline-flex items-center rounded-md border">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-sm hover:bg-gray-50"
                    aria-label="Decrease quantity"
                    type="button"
                  >
                    −
                  </button>
                  <div className="min-w-10 px-3 py-2 text-center text-sm">
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2 text-sm hover:bg-gray-50"
                    aria-label="Increase quantity"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => alert(`Selected: ${size}, Qty: ${qty}`)}
                className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
                type="button"
              >
                Purchase
              </button>
            </div>
          </div>
        </div>

        {/* Bottom cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card title="Description">
            <p className="text-sm text-gray-700">{product.description}</p>
          </Card>

          <Card title="Features">
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Card>

          <Card title={`About ${product.college}`}>
            <p className="text-sm text-gray-700">{product.about}</p>
          </Card>
        </div>
      </div>
    </main>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-semibold">{title}</p>
      {children}
    </div>
  );
}
