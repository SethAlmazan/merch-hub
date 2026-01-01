"use client";

import CartItemRow from "@/components/cart/CartItemRow";
import CheckoutCard from "@/components/cart/CheckoutCard";
import { useCart } from "@/components/cart/CartProvider";

export default function CartPage() {
  const { items, itemCount } = useCart();

  return (
    <main className="min-h-screen bg-black/80 p-6">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Shopping Cart */}
        <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg border bg-gray-50 flex items-center justify-center">
              <span className="text-sm">🛒</span>
            </div>
            <div className="text-sm font-semibold">Shopping Cart ({itemCount} items)</div>
          </div>

          <div className="mt-4 space-y-3">
            {items.length === 0 ? (
              <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
                Your cart is empty.
              </div>
            ) : (
              items.map((it) => <CartItemRow key={it.id} item={it} />)
            )}
          </div>
        </div>

        {/* Right: Checkout */}
        <CheckoutCard />
      </div>
    </main>
  );
}
