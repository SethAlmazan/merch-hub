import Image from "next/image";
import NavbarUserMenu from "@/components/NavbarUserMenu";

export default function HomePage() {
  const colleges = [
    { name: "Faculty of Engineering", productPrefix: "eng" },
    { name: "Faculty of Computing", productPrefix: "comp" },
    { name: "Faculty of Education", productPrefix: "edu" },
  ];

  const featuredOrganizations = [
    { name: "Faculty of Engineering", products: 6 },
    { name: "Faculty of Computing", products: 5 },
    { name: "Faculty of Education", products: 3 },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 gap-4">
          {/* Left: logo + title */}
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

          {/* Center: search */}
          <div className="hidden md:flex flex-1 justify-center">
            <input
              type="text"
              placeholder="Search merchandise"
              className="w-full max-w-xl rounded-full border px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <button className="hidden text-sm md:inline">Help</button>

            {/* Cart icon */}
            <button className="relative rounded-full border p-2 hover:bg-gray-100">
              <span className="text-lg">🛒</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                0
              </span>
            </button>

            {/* ✅ Login becomes Profile dropdown when logged in */}
            <NavbarUserMenu />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex h-107.5 md:h-125 items-center justify-center text-center text-white bg-[url('/vsu-hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-wide uppercase">
            OFFICIAL <br />
            VSU MERCH HUB
          </h1>
          <p className="mt-4 md:mt-5 max-w-3xl mx-auto text-sm md:text-lg font-medium">
            Welcome to your one-stop-shop for official school shirts, caps, bags,
            ID lanyards, and more.
          </p>
          <div className="mt-8">
            <a
              href="#products"
              className="inline-block rounded-full border-2 border-white px-10 py-3 text-lg md:text-xl font-semibold hover:bg-white hover:text-black transition"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {colleges.map((college, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold">{college.name}</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <article
                  key={i}
                  className="group rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md overflow-hidden"
                >
                  <div
                    className="h-48 bg-gray-200"
                    style={{
                      backgroundImage: `url(/${college.productPrefix}-product${i}.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-4 space-y-1">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700">
                      {college.name}
                    </p>
                    <p className="text-sm font-semibold">Sample Shirt {i}</p>
                    <p className="text-sm font-bold text-emerald-700">₱450.00</p>
                    <button className="mt-3 w-full rounded-full bg-black py-2 text-xs md:text-sm font-medium text-white group-hover:bg-gray-900">
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* FEATURED ORGS */}
      <section className="bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-center mb-8">
            Featured Organizations
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {featuredOrganizations.map((org, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white shadow-sm p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold mb-2">{org.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {org.products} products available
                </p>
                <a href="#" className="inline-block text-sm text-blue-600 hover:underline">
                  View Products
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-600 text-white text-center py-6 mt-10">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-lg font-semibold">VSU Merch Hub</p>
          <p className="mt-2">
            Supporting student organizations and VSU community through quality
            merchandise
          </p>
          <p className="mt-2">Payment: Cash on Delivery &amp; GCASH</p>
          <p>Delivery: Campus Pickup &amp; Delivery</p>
          <p className="mt-4 text-sm">
            © 2025 Visayas State University. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
