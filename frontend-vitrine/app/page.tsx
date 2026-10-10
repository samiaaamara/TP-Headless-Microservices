
export const instant = false;
type TextNode = {
  text?: string;
};

type DescriptionBlock = {
  children?: TextNode[];
};

type Product = {
  id: number;
  title: string;
  description?: DescriptionBlock[];
  price: number;
  image?: {
    url: string;
    alternativeText?: string | null;
    formats?: {
      medium?: { url: string };
      small?: { url: string };
    };
  } | null;
  category?: {
    name: string;
  } | null;
};

type ProductsResponse = {
  data: Product[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const STRAPI_INTERNAL_URL =
  process.env.STRAPI_INTERNAL_URL || API_URL;

async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    `${STRAPI_INTERNAL_URL}/api/products?populate=*`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer les produits depuis Strapi.");
  }

  const result: ProductsResponse = await response.json();
  return result.data;
}

export default async function Home() {
  let products: Product[] = [];
  let error = "";

  try {
    products = await getProducts();
  } catch {
    error =
      "Impossible de charger les produits. Vérifiez que Strapi est démarré.";
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-blue-950 px-6 py-5 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold">PhoneTech Accessories</h1>
          <span className="text-sm text-blue-100">
            Votre boutique d’accessoires
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-blue-700">
            Notre catalogue
          </p>
          <h2 className="text-4xl font-extrabold">
            Accessoires pour votre smartphone
          </h2>
          <p className="mt-4 text-slate-600">
            Découvrez nos coques, chargeurs et écouteurs.
          </p>
        </div>

        {error ? (
          <p className="rounded-lg bg-red-100 p-4 text-center text-red-700">
            {error}
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-600">
            Aucun produit publié pour le moment.
          </p>
        ) : (
          <>
            <p className="mb-6 text-slate-600">
              {products.length} produits disponibles
            </p>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => {
                const imagePath =
                  product.image?.formats?.medium?.url ||
                  product.image?.formats?.small?.url ||
                  product.image?.url;

                const description =
                  product.description
                    ?.map((block) =>
                      block.children
                        ?.map((child) => child.text || "")
                        .join("")
                    )
                    .join(" ") || "Découvrez ce produit.";

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex h-56 items-center justify-center bg-white p-4">
                      {imagePath ? (
                        <img
                          src={`${API_URL}${imagePath}`}
                          alt={
                            product.image?.alternativeText ||
                            product.title
                          }
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-slate-400">
                          Image indisponible
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        {product.category?.name || "Accessoire"}
                      </span>

                      <h3 className="mt-3 text-lg font-bold">
                        {product.title}
                      </h3>

                      <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">
                        {description}
                      </p>

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="text-2xl font-extrabold text-blue-800">
                          {Number(product.price).toFixed(2)} TND
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      <footer className="bg-blue-950 px-6 py-6 text-center text-sm text-blue-100">
        © 2026 PhoneTech Accessories — Vitrine alimentée par Strapi CMS
      </footer>
    </main>
  );
}
