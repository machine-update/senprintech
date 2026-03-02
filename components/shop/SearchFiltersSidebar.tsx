"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

type CategoryItem = { id: string; name: string; slug: string };

type Props = {
  categories: CategoryItem[];
  initial: {
    q: string;
    category: string;
    max: number | undefined;
    sort: string;
    onlyNew: boolean;
  };
  maxPriceCap: number;
};

export default function SearchFiltersSidebar({ categories, initial, maxPriceCap }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState(initial.q);
  const [category, setCategory] = useState(initial.category);
  const [maxPrice, setMaxPrice] = useState<number>(initial.max ?? maxPriceCap);
  const [sort, setSort] = useState(initial.sort);
  const [onlyNew, setOnlyNew] = useState(initial.onlyNew);
  const [autoApply, setAutoApply] = useState(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (maxPrice > 0) params.set("max", String(maxPrice));
    if (sort && sort !== "popular") params.set("sort", sort);
    if (onlyNew) params.set("new", "1");
    params.set("page", "1");
    return params.toString();
  }, [q, category, maxPrice, sort, onlyNew]);

  useEffect(() => {
    if (!autoApply) return;
    const timeout = setTimeout(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }, 230);
    return () => clearTimeout(timeout);
  }, [autoApply, pathname, queryString, router]);

  function applyFilters() {
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <aside className="surface-card mobile-sticky-aside" style={{ padding: 14, position: "sticky", top: 110, height: "fit-content" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Filtres</h2>
        <SlidersHorizontal size={16} color="#334155" />
      </div>
      <p style={{ margin: "4px 0 12px", fontSize: 13, color: "#64748b" }}>Affinez vos résultats en temps réel.</p>

      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 5 }}>
          <span style={labelStyle}>Recherche</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="t-shirt, flyer..." style={field} />
        </label>

        <label style={{ display: "grid", gap: 5 }}>
          <span style={labelStyle}>Catégorie</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={field}>
            <option value="">Toutes</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 5 }}>
          <span style={labelStyle}>Prix maximum: {maxPrice.toLocaleString("fr-FR")} FCFA</span>
          <input
            type="range"
            min={0}
            max={maxPriceCap}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ accentColor: "#0f172a" }}
          />
          <input
            type="number"
            min={0}
            max={maxPriceCap}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(0, Number(e.target.value) || 0))}
            style={field}
          />
        </label>

        <label style={{ display: "grid", gap: 5 }}>
          <span style={labelStyle}>Tri</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={field}>
            <option value="popular">Popularité</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="new">Nouveautés</option>
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155" }}>
          <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} />
          Afficher seulement les nouveautés
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155" }}>
          <input type="checkbox" checked={autoApply} onChange={(e) => setAutoApply(e.target.checked)} />
          Activation automatique des filtres
        </label>

        <button type="button" onClick={applyFilters} style={applyButton}>
          Appliquer les filtres
        </button>
      </div>
    </aside>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#475569",
  fontWeight: 600,
};

const field: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d6dee9",
  borderRadius: 10,
  padding: "9px 10px",
  background: "#fff",
};

const applyButton: React.CSSProperties = {
  border: "none",
  borderRadius: 10,
  padding: "10px 12px",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 12px 22px -18px rgba(2,6,23,0.72)",
};
