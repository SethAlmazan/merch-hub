"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import type { DeliveryMethod, PaymentMethod } from "@/lib/cart/types";
import { supabase } from "@/lib/supabase/client";

function money(n: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
}

const DELIVERY_LOCATIONS = ["VSU Main Campus", "Baybay City Proper", "Gaas", "Poblacion"];
const DELIVERY_TIMES = ["9:00 AM", "10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

function parsePaymentMethod(v: string): PaymentMethod | "" {
  return v === "cod" || v === "gcash" ? v : "";
}

function parseDeliveryMethod(v: string): DeliveryMethod | "" {
  return v === "pickup" || v === "deliver" ? v : "";
}

export default function CheckoutCard() {
  const { items, subtotal, clear } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | "">("");

  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const deliveryFee = useMemo(() => (deliveryMethod === "deliver" ? 10 : 0), [deliveryMethod]);
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (deliveryMethod !== "deliver") {
      setDeliveryLocation("");
      setDeliveryDate("");
      setDeliveryTime("");
    }
  }, [deliveryMethod]);

  async function placeOrder() {
    setError(null);
    setSuccessMsg(null);

    if (items.length === 0) return setError("Your cart is empty.");
    if (!paymentMethod) return setError("Please choose a payment method.");
    if (!deliveryMethod) return setError("Please choose a delivery method.");

    if (deliveryMethod === "deliver") {
      if (!deliveryLocation) return setError("Please choose a delivery location.");
      if (!deliveryDate) return setError("Please choose a delivery date.");
      if (!deliveryTime) return setError("Please choose a delivery time.");
    }

    setPlacing(true);
    try {
      // Require login for checkout
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError("Please log in before placing an order.");
        return;
      }

      // ✅ For now: no DB insert. Just simulate success.
      clear();
      setSuccessMsg("Order placed successfully!");
      setPaymentMethod("");
      setDeliveryMethod("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order.";
      setError(msg);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg border bg-gray-50 flex items-center justify-center">
          <span className="text-sm">🧾</span>
        </div>
        <div className="text-sm font-semibold">Checkout</div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="text-xs font-semibold text-gray-700">Payment Method</div>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(parsePaymentMethod(e.target.value))}
          className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="" disabled>
            Choose payment method
          </option>
          <option value="cod">Cash on Delivery</option>
          <option value="gcash">GCash</option>
        </select>

        {paymentMethod === "gcash" ? (
          <div className="rounded-xl border bg-emerald-50 p-3 text-xs text-emerald-900">
            <div className="font-semibold">GCash payment</div>
            <div className="mt-1 text-emerald-800/90">
              Put your GCash details here (name + number).
            </div>
          </div>
        ) : null}

        <div className="pt-2 text-xs font-semibold text-gray-700">Delivery Method</div>
        <select
          value={deliveryMethod}
          onChange={(e) => setDeliveryMethod(parseDeliveryMethod(e.target.value))}
          className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="" disabled>
            Choose delivery method
          </option>
          <option value="pickup">Pickup (free)</option>
          <option value="deliver">Deliver (₱10)</option>
        </select>

        {deliveryMethod === "deliver" ? (
          <div className="rounded-xl border bg-emerald-50 p-3">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                  <span>📍</span> Delivery Location
                </div>
                <select
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="" disabled>
                    Choose delivery location
                  </option>
                  {DELIVERY_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                  <span>📅</span> Delivery Date
                </div>
                <input
                  type="date"
                  min={today}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                  <span>⏰</span> Delivery Time
                </div>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="" disabled>
                    Choose delivery time
                  </option>
                  {DELIVERY_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : null}

        <div className="pt-2 text-sm">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-gray-900">{money(subtotal)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
            <span>Delivery:</span>
            <span className="font-semibold text-gray-900">{money(deliveryFee)}</span>
          </div>
          <div className="mt-3 border-t pt-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Total:</span>
            <span className="text-sm font-bold">{money(total)}</span>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
            {error}
          </div>
        ) : null}

        {successMsg ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
            {successMsg}
          </div>
        ) : null}

        <button
          disabled={placing || items.length === 0}
          onClick={placeOrder}
          className="mt-1 w-full rounded-lg bg-emerald-400 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {placing ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
