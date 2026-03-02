"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/use-cart-store";
import { calculateProductPrice, type ProductOption } from "@/lib/pricing";
import { formatFcfa } from "@/lib/currency";

type ProductPayload = {
  id: string;
  name: string;
  basePrice: number;
  options: ProductOption[];
  images: string[];
};

export default function ProductConfigurator({ product }: { product: ProductPayload }) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [feedback, setFeedback] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const unitPrice = useMemo(
    () => calculateProductPrice(product.basePrice, product.options, selected),
    [product.basePrice, product.options, selected]
  );

  const total = useMemo(() => Number((unitPrice * qty).toFixed(2)), [unitPrice, qty]);

  const requiredOptions = product.options.length;
  const selectedOptions = Object.keys(selected).length;
  const readyToAdd = selectedOptions >= requiredOptions;

  function addToCart() {
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: unitPrice,
      quantity: qty,
      options: selected,
      previewUrl: product.images[0],
    });
    setFeedback("Produit ajoute au panier");
    setTimeout(() => setFeedback(""), 2200);
  }

  return (
    <section
      id="product-configurator"
      className="mobile-with-sticky"
      style={{
        border: "1px solid #dbe4f0",
        borderRadius: 12,
        background: "#fff",
        padding: 18,
        boxShadow: "0 10px 24px -20px rgba(2,6,23,0.58)",
      }}
    >
      <h3 style={{ margin: "0 0 6px", fontSize: 23 }}>Configurer votre produit</h3>
      <p style={{ margin: "0 0 12px", color: "#475569", fontSize: 14 }}>
        Choisissez vos options pour obtenir un prix final en temps reel.
      </p>

      <div style={{ display: "grid", gap: 14 }}>
        {product.options.map((option) => (
          <div key={option.name}>
            <p style={{ margin: "0 0 8px", fontWeight: 700 }}>{option.name}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {option.values.map((value) => {
                const active = selected[option.name] === value.label;
                return (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    key={value.label}
                    onClick={() => setSelected((prev) => ({ ...prev, [option.name]: value.label }))}
                    style={{
                      border: active ? "1px solid #1d4ed8" : "1px solid #cbd5e1",
                      background: active ? "#eff6ff" : "#fff",
                      borderRadius: 999,
                      padding: "7px 12px",
                      cursor: "pointer",
                      fontWeight: active ? 700 : 500,
                    }}
                    type="button"
                  >
                    {value.label}
                    {value.priceSurge > 0 ? ` (+${formatFcfa(value.priceSurge)})` : ""}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        <label htmlFor="qty" style={{ fontWeight: 700 }}>
          Quantite
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => setQty((prev) => Math.max(1, prev - 1))} style={qtyButton}>
            -
          </motion.button>
          <input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            style={{ width: 90, border: "1px solid #cbd5e1", borderRadius: 10, padding: "9px 10px", textAlign: "center" }}
          />
          <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => setQty((prev) => prev + 1)} style={qtyButton}>
            +
          </motion.button>
        </div>
      </div>

      <div style={{ marginTop: 16, borderTop: "1px dashed #cbd5e1", paddingTop: 14, display: "grid", gap: 8 }}>
        <p style={{ margin: 0 }}>
          Prix unitaire: <strong>{formatFcfa(unitPrice)}</strong>
        </p>
        <p style={{ margin: 0 }}>
          Total estime: <strong>{formatFcfa(total)}</strong>
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>
          Configuration: {selectedOptions}/{requiredOptions} options selectionnees
        </p>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={addToCart}
          disabled={!readyToAdd}
          style={{
            marginTop: 6,
            background: readyToAdd ? "#0f172a" : "#94a3b8",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px 14px",
            fontWeight: 800,
            cursor: readyToAdd ? "pointer" : "not-allowed",
          }}
        >
          Ajouter au panier
        </motion.button>

        {feedback ? <p style={{ margin: 0, color: "#166534", fontWeight: 700 }}>{feedback}</p> : null}
      </div>

      <div className="mobile-sticky-action" aria-live="polite">
        <div>
          <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Total estime</p>
          <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{formatFcfa(total)}</p>
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={!readyToAdd}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "10px 12px",
            background: readyToAdd ? "#0f172a" : "#94a3b8",
            color: "#fff",
            fontWeight: 700,
            cursor: readyToAdd ? "pointer" : "not-allowed",
          }}
        >
          Ajouter au panier
        </button>
      </div>
    </section>
  );
}

const qtyButton: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  width: 34,
  height: 34,
  background: "#fff",
  cursor: "pointer",
  fontWeight: 800,
};
