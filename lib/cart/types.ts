export type PaymentMethod = "cod" | "gcash";
export type DeliveryMethod = "pickup" | "deliver";

export type CartItem = {
  id: string; // include variant in id (ex: "eng-product2-M")
  title: string;
  orgName?: string;
  imageUrl: string;
  price: number; // PHP
  qty: number;

  // optional for showing size/variant in cart
  variant?: string; // ex: "Size: M"
};
