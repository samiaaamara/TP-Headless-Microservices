
"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string | number;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"
).replace(/\/$/, "");

function unwrap(value: any): any {
  if (!value) return {};
  if (Array.isArray(value)) return value[0] ?? {};
  if (value.data !== undefined) return unwrap(value.data);
  return value.attributes ?? value;
}

function getCategoryName(value: any): string {
  const category = unwrap(value);
  return category.name || category.title || "";
}

function getImageUrl(value: any): string {
  const image = unwrap(value);
  const url =
    image.url ||
    image.formats?.medium?.url ||
    image.formats?.small?.url ||
    image.formats?.thumbnail?.url;

  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function normalizeProduct(item: any): Product {
  const data = item?.attributes ?? item;

  return {
    id: item?.documentId || item?.id || data?.id,
    title: data?.title || data?.name || "Produit sans nom",
    description:
      typeof data?.description === "string" ? data.description : "",
    price: Number(data?.price ?? 0),
    category: getCategoryName(data?.category) || "Autres",
    imageUrl: getImageUrl(data?.image),
  };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products?populate=*`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const json = await response.json();
        const items = Array.isArray(json.data) ? json.data : [];

        setProducts(items.map(normalizeProduct));
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(
            "Impossible de charger les produits. Vérifie que Strapi fonctionne."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [
      "Toutes",
      ...Array.from(
        new Set(
          products.map((product) => product.category).filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "fr")),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("fr");

    return products.filter((product) => {
      const matchesSearch =
        product.title.toLocaleLowerCase("fr").includes(term) ||
        product.description.toLocaleLowerCase("fr").includes(term) ||
        product.category.toLocaleLowerCase("fr").includes(term);

      const matchesCategory =
        selectedCategory === "Toutes" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
       minimumFractionDigits: 3,
    maximumFractionDigits: 3,
    }).format(price);

  return (
    <main>
      {/* Barre supérieure */}
      <div className="topbar">
        Découvrez notre sélection d’accessoires pour smartphone
      </div>

      {/* Navigation */}
      <header className="site-header">
        <a className="brand" href="#" aria-label="PhoneTech accueil">
          <span className="brand-icon">P</span>
          <span>
            Phone<span className="brand-accent">Tech</span>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navigation principale">
          <a className="nav-active" href="#">
            Accueil
          </a>
          <a href="#catalogue">Nos produits</a>
          <a href="#footer">À propos</a>
        </nav>

        <a className="header-cta" href="#catalogue">
          Découvrir la boutique <span>↗</span>
        </a>
      </header>

      {/* Bannière d'accueil */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            <span className="status-dot" />
            LA TECHNOLOGIE AU QUOTIDIEN
          </span>

          <h1>
            Les bons accessoires.
            <br />
            <span>La meilleure expérience.</span>
          </h1>

          <p>
            Découvrez notre sélection d’accessoires pour accompagner
            votre smartphone, au travail comme au quotidien.
          </p>

          <a className="primary-button" href="#catalogue">
            Explorer les produits <span>→</span>
          </a>

          <div className="hero-trust">
            <span>
              <b>✓</b> Sélection soignée
            </span>
            <span>
              <b>✓</b> Des essentiels utiles
            </span>
          </div>
        </div>

        {/* Illustration décorative réalisée en CSS */}
        <div
          className="hero-visual"
          aria-label="Illustration d’un smartphone"
          role="img"
        >
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="visual-card-main">
            <div className="visual-label">PHONE TECH / COLLECTION</div>

            <div className="phone-illustration">
              <div className="phone-screen">
                <div className="screen-camera" />
                <div className="screen-glow" />
                <span>PT.</span>
              </div>
            </div>
          </div>

          <div className="floating-item floating-earbuds">♫</div>
          <div className="floating-item floating-bolt">ϟ</div>

          <div className="visual-caption">
            <span />
            Accessoires pensés pour vous
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="benefits" aria-label="Nos avantages">
        <div className="benefit">
          <span className="benefit-icon">◇</span>
          <div>
            <strong>Une sélection pratique</strong>
            <small>Les essentiels du quotidien</small>
          </div>
        </div>

        <div className="benefit">
          <span className="benefit-icon">◎</span>
          <div>
            <strong>Un choix simplifié</strong>
            <small>Trouvez l’accessoire adapté</small>
          </div>
        </div>

        <div className="benefit">
          <span className="benefit-icon">↗</span>
          <div>
            <strong>Une vitrine intuitive</strong>
            <small>Parcourez nos produits facilement</small>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="catalog-section" id="catalogue">
        <div className="section-heading">
          <div>
            <span className="section-kicker">LA BOUTIQUE</span>
            <h2>Nos accessoires</h2>
            <p>
              Des indispensables pour compléter votre équipement.
            </p>
          </div>

          <span className="product-count">
            {loading
              ? "Chargement…"
              : `${filteredProducts.length} produit(s)`}
          </span>
        </div>

        {/* Recherche et filtre */}
        <div className="catalog-tools">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Rechercher un produit"
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
          </label>

          <label className="category-select-label">
            <span>Catégorie</span>

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              aria-label="Filtrer par catégorie"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Boutons des catégories */}
        {!loading && !error && categories.length > 1 && (
          <div
            className="category-chips"
            aria-label="Filtres rapides par catégorie"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-chip ${
                  selectedCategory === category ? "selected" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Chargement */}
        {loading && (
          <div className="state-message">
            <span className="loader" />
            <p>Chargement des produits depuis Strapi…</p>
          </div>
        )}

        {/* Erreur API */}
        {!loading && error && (
          <div className="state-message error-message">
            <span className="state-symbol">!</span>
            <h3>La boutique est momentanément indisponible</h3>
            <p>{error}</p>

            <button
              className="secondary-button"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="state-message">
            <span className="state-symbol">⌕</span>
            <h3>Aucun produit trouvé</h3>
            <p>
              Essaie un autre mot-clé ou choisis une autre catégorie.
            </p>

            <button
              className="secondary-button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("Toutes");
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Cartes produits */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <span className="product-category">
                    {product.category}
                  </span>

                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>PT.</span>
                      <small>PHONE TECH</small>
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <span className="product-subtitle">
                    PHONE TECH ACCESSORIES
                  </span>

                  <h3>{product.title}</h3>

                  {product.description && (
                    <p className="product-description">
                      {product.description
                        .replace(/<[^>]*>/g, " ")
                        .slice(0, 110)}
                    </p>
                  )}

                  <div className="product-bottom">
                    <span className="product-price">
                      {formatPrice(product.price)}
                    </span>
                    <span className="product-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Bannière finale */}
      <section className="closing-banner">
        <div>
          <span className="section-kicker">PHONE TECH</span>
          <h2>
            Un petit accessoire.
            <br />
            Une grande différence.
          </h2>
          <p>
            Parcourez notre sélection et trouvez vos essentiels
            technologiques.
          </p>
        </div>

        <a className="light-button" href="#catalogue">
          Voir le catalogue <span>→</span>
        </a>
      </section>

      {/* Pied de page */}
      <footer className="site-footer" id="footer">
        <a className="brand footer-brand" href="#">
          <span className="brand-icon">P</span>
          <span>
            Phone<span className="brand-accent">Tech</span>
          </span>
        </a>

        <p>
          Les accessoires qui vous accompagnent au quotidien.
        </p>

        <span className="copyright">
            © 2026 PhoneTech Accessories
        </span>
      </footer>
    </main>
  );
}
