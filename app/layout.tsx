import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/CartProvider";

export const metadata: Metadata = {
  title: "VSU Merch Hub",
  description: "Official VSU merchandise online store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-100 text-gray-900 antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
