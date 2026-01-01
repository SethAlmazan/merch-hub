// app/products/data.ts

export type Product = {
  id: string;
  college: string;
  title: string;
  category: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  about: string;
};

const COLLEGES: Record<
  string,
  { college: string; titlePrefix: string; category: string }
> = {
  eng: {
    college: "Faculty of Engineering",
    titlePrefix: "VSU Faculty of Engineering",
    category: "Clothing",
  },
  comp: {
    college: "Faculty of Computing",
    titlePrefix: "VSU Faculty of Computing",
    category: "Clothing",
  },
  edu: {
    college: "Faculty of Education",
    titlePrefix: "VSU Faculty of Education",
    category: "Clothing",
  },
};

export function getProductById(id: unknown): Product | null {
  // ✅ prevent crash if id is undefined
  if (typeof id !== "string") return null;

  const match = id.match(/^(eng|comp|edu)-product([1-3])$/);
  if (!match) return null;

  const prefix = match[1];
  const num = match[2];

  const meta = COLLEGES[prefix];
  if (!meta) return null;

  return {
    id,
    college: meta.college,
    title: `${meta.titlePrefix} Product ${num}`,
    category: meta.category,
    price: 450,
    image: `/${id}.jpg`,
    description:
      "High-quality Product with the official design. Perfect for everyday wear or representing your college pride.",
    features: [
      "100% premium cotton fabric",
      "Official design print",
      "Available in multiple sizes",
    ],
    about: `Official merchandise from ${meta.college}. All proceeds support student activities and organization initiatives.`,
  };
}
