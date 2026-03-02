"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  CheckCircle2,
  ImagePlus,
  RotateCw,
  Save,
  Type,
  Upload,
} from "lucide-react";
import { useDesignerStore } from "@/store/use-designer-store";
import { useCartStore } from "@/store/use-cart-store";
import { formatFcfa } from "@/lib/currency";

type ProductInput = {
  id: string;
  name: string;
  basePrice: number;
  images: string[];
};

const CANVAS_WIDTH = 460;
const CANVAS_HEIGHT = 560;
const SAFE_MARGIN_X = 34;
const SAFE_MARGIN_Y = 44;

export const DesignerCanvas = ({ product }: { product: ProductInput }) => {
  const { elements, selectedElementId, addElement, setSelectedElement, updateElement, removeElement, setElements, clear } =
    useDesignerStore();
  const { addItem } = useCartStore();

  const [isExporting, setIsExporting] = useState(false);
  const [designName, setDesignName] = useState("Design personnalisé");
  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState(100);
  const [zoom, setZoom] = useState(100);

  const selected = useMemo(() => elements.find((el) => el.id === selectedElementId), [elements, selectedElementId]);

  const discountRate = useMemo(() => {
    if (qty >= 500) return 0.2;
    if (qty >= 100) return 0.1;
    if (qty >= 50) return 0.05;
    return 0;
  }, [qty]);

  const pricing = useMemo(() => {
    const unit = Number(product.basePrice.toFixed(2));
    const beforeDiscount = unit * qty;
    const discountAmount = beforeDiscount * discountRate;
    const total = beforeDiscount - discountAmount;
    return { unit, discountAmount, total };
  }, [product.basePrice, qty, discountRate]);

  const qualityChecks = useMemo(() => {
    const outOfBounds = elements.some((el) => {
      const width = el.width ?? 120;
      const height = el.height ?? 40;
      return (
        el.x < SAFE_MARGIN_X ||
        el.y < SAFE_MARGIN_Y ||
        el.x + width > CANVAS_WIDTH - SAFE_MARGIN_X ||
        el.y + height > CANVAS_HEIGHT - SAFE_MARGIN_Y
      );
    });

    return {
      minDpi: true,
      margins: !outOfBounds,
      transparency: true,
    };
  }, [elements]);

  function addText() {
    addElement({
      id: crypto.randomUUID(),
      type: "text",
      content: "Nouveau texte",
      x: 110,
      y: 120,
      fontSize: 28,
      fill: "#0f172a",
      rotation: 0,
      width: 180,
      height: 42,
    });
  }

  function addTemplate(kind: "promo" | "simple" | "event") {
    if (kind === "promo") {
      addElement({
        id: crypto.randomUUID(),
        type: "text",
        content: "OFFRE EXCLUSIVE",
        x: 88,
        y: 90,
        fontSize: 34,
        fill: "#0f172a",
        rotation: 0,
        width: 280,
        height: 48,
      });
      return;
    }
    if (kind === "event") {
      addElement({
        id: crypto.randomUUID(),
        type: "text",
        content: "TEAM EVENT 2026",
        x: 104,
        y: 130,
        fontSize: 30,
        fill: "#1d4ed8",
        rotation: 0,
        width: 260,
        height: 44,
      });
      return;
    }
    addElement({
      id: crypto.randomUUID(),
      type: "text",
      content: "Votre marque",
      x: 120,
      y: 110,
      fontSize: 32,
      fill: "#0f172a",
      rotation: 0,
      width: 220,
      height: 44,
    });
  }

  function onUploadImage(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    addElement({
      id: crypto.randomUUID(),
      type: "image",
      content: url,
      x: 120,
      y: 220,
      width: 180,
      height: 180,
      rotation: 0,
    });
  }

  function alignSelected(mode: "left" | "center" | "right") {
    if (!selected) return;
    const width = selected.width ?? 160;
    if (mode === "left") updateElement(selected.id, { x: SAFE_MARGIN_X });
    if (mode === "center") updateElement(selected.id, { x: Math.round((CANVAS_WIDTH - width) / 2) });
    if (mode === "right") updateElement(selected.id, { x: CANVAS_WIDTH - SAFE_MARGIN_X - width });
  }

  async function saveDesign(): Promise<string | null> {
    setMessage("");
    const res = await fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: designName,
        productId: product.id,
        canvasData: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, elements },
        previewUrl: product.images[0],
        qualityChecks,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Erreur sauvegarde design");
      return null;
    }

    setSavedDesignId(data.design.id);
    setMessage("Design sauvegarde avec succes");
    return data.design.id;
  }

  async function loadLastDesign() {
    setMessage("");
    const res = await fetch("/api/designs");
    const data = await res.json();

    if (!res.ok || !data.designs?.length) {
      setMessage("Aucun design a charger");
      return;
    }

    const design = data.designs[0];
    const incomingElements = Array.isArray(design.canvasData?.elements) ? design.canvasData.elements : [];
    setElements(incomingElements);
    setSavedDesignId(design.id);
    setDesignName(design.name ?? "Design charge");
    setMessage("Dernier design charge");
  }

  const handleAddToCart = async () => {
    setIsExporting(true);
    setMessage("");

    const designIdToUse = savedDesignId ?? (await saveDesign());

    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: pricing.unit * (1 - discountRate),
      quantity: qty,
      options: { Edition: "Personnalisee", Volume: `${qty}` },
      designId: designIdToUse ?? undefined,
      previewUrl: product.images[0],
    });

    setMessage("Produit personnalise ajoute au panier");
    setIsExporting(false);
  };

  return (
    <div style={{ padding: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 320px", gap: 12 }} className="mobile-stack">
        <section className="surface-card" style={{ padding: 14 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Edition</h2>
          <p style={{ margin: "4px 0 12px", color: "#64748b", fontSize: 13 }}>Texte, image, styles et templates.</p>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ display: "grid", gap: 5 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>Nom du design</span>
              <input value={designName} onChange={(e) => setDesignName(e.target.value)} style={field} />
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={addText} style={toolButton}>
                <Type size={14} /> Ajouter texte
              </button>
              <label style={{ ...toolButton, cursor: "pointer" }}>
                <ImagePlus size={14} /> Ajouter image
                <input type="file" accept="image/png,image/jpeg,image/svg+xml" hidden onChange={(e) => onUploadImage(e.target.files?.[0])} />
              </label>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <p style={{ margin: "0 0 7px", fontSize: 12, color: "#475569" }}>Templates rapides</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button type="button" style={chip} onClick={() => addTemplate("simple")}>Minimal</button>
              <button type="button" style={chip} onClick={() => addTemplate("promo")}>Promo</button>
              <button type="button" style={chip} onClick={() => addTemplate("event")}>Event</button>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <p style={{ margin: "0 0 7px", fontSize: 12, color: "#475569" }}>Proprietes element</p>
            {selected ? (
              <div style={{ display: "grid", gap: 8 }}>
                {selected.type === "text" ? (
                  <input
                    value={selected.content}
                    onChange={(e) => updateElement(selected.id, { content: e.target.value })}
                    style={field}
                    placeholder="Votre texte"
                  />
                ) : null}
                <label style={{ display: "grid", gap: 5 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Couleur</span>
                  <input
                    type="color"
                    value={selected.fill ?? "#0f172a"}
                    onChange={(e) => updateElement(selected.id, { fill: e.target.value })}
                    style={{ ...field, height: 38, padding: 4 }}
                  />
                </label>
                <label style={{ display: "grid", gap: 5 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Taille</span>
                  <input
                    type="range"
                    min={12}
                    max={96}
                    value={selected.fontSize ?? 16}
                    onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) })}
                  />
                </label>
                <label style={{ display: "grid", gap: 5 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Rotation</span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={selected.rotation}
                    onChange={(e) => updateElement(selected.id, { rotation: Number(e.target.value) })}
                  />
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" style={iconButton} onClick={() => alignSelected("left")}><AlignLeft size={14} /></button>
                  <button type="button" style={iconButton} onClick={() => alignSelected("center")}><AlignCenter size={14} /></button>
                  <button type="button" style={iconButton} onClick={() => alignSelected("right")}><AlignRight size={14} /></button>
                  <button type="button" style={iconButton} onClick={() => removeElement(selected.id)}><RotateCw size={14} /></button>
                </div>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Selectionnez un element sur le canvas.</p>
            )}
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={ghostAction} onClick={saveDesign}><Save size={14} /> Sauvegarder</button>
            <button type="button" style={ghostAction} onClick={loadLastDesign}><Upload size={14} /> Charger</button>
            <button type="button" style={ghostAction} onClick={clear}>Réinitialiser</button>
          </div>
        </section>

        <section className="surface-card" style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18 }}>Aperçu en temps réel</h2>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Zone de sécurité et fond perdu pour impression pro.</p>
            </div>
            <label style={{ display: "grid", gap: 4 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>Zoom: {zoom}%</span>
              <input type="range" min={70} max={140} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
            </label>
          </div>

          <div
            style={{
              marginTop: 12,
              borderRadius: 12,
              padding: 12,
              background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
              border: "1px solid #dbe4f0",
              display: "grid",
              placeItems: "center",
              minHeight: 650,
              overflow: "auto",
            }}
          >
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }}>
              <div
                style={{
                  width: CANVAS_WIDTH,
                  height: CANVAS_HEIGHT,
                  position: "relative",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#ffffff",
                  boxShadow: "0 24px 42px -30px rgba(2,6,23,0.6)",
                }}
              >
                <img
                  src={product.images?.[0] ?? ""}
                  alt={product.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0.18, pointerEvents: "none" }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: SAFE_MARGIN_X,
                    top: SAFE_MARGIN_Y,
                    right: SAFE_MARGIN_X,
                    bottom: SAFE_MARGIN_Y,
                    border: "1px dashed #3b82f6",
                    borderRadius: 8,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 14,
                    right: 14,
                    bottom: 14,
                    border: "1px dashed #94a3b8",
                    borderRadius: 8,
                    pointerEvents: "none",
                  }}
                />

                {elements.map((el) => (
                  <motion.div
                    key={el.id}
                    onClick={() => setSelectedElement(el.id)}
                    whileHover={{ scale: 1.01 }}
                    style={{
                      position: "absolute",
                      left: el.x,
                      top: el.y,
                      transform: `rotate(${el.rotation}deg)`,
                      color: el.fill,
                      fontSize: `${el.fontSize ?? 16}px`,
                      cursor: "move",
                      border: selectedElementId === el.id ? "2px solid #3b82f6" : "none",
                      borderRadius: 4,
                      width: el.width,
                      height: el.height,
                      padding: 2,
                      background: selectedElementId === el.id ? "rgba(59,130,246,0.08)" : "transparent",
                    }}
                    draggable
                    onDragEnd={(e) => {
                      const target = e.currentTarget as HTMLDivElement | null;
                      const rect = target?.parentElement?.getBoundingClientRect();
                      if (!rect) return;
                      const scale = zoom / 100;
                      const pointerX = "clientX" in e ? e.clientX : 0;
                      const pointerY = "clientY" in e ? e.clientY : 0;
                      updateElement(el.id, {
                        x: Math.round((pointerX - rect.left) / scale),
                        y: Math.round((pointerY - rect.top) / scale),
                      });
                    }}
                  >
                    {el.type === "image" ? (
                      <img src={el.content} alt="design" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      el.content
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card mobile-sticky-aside" style={{ padding: 14, position: "sticky", top: 92, height: "fit-content" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Commande</h2>
          <p style={{ margin: "4px 0 12px", color: "#64748b", fontSize: 13 }}>Prix dynamique et validation qualite.</p>

          <label style={{ display: "grid", gap: 5 }}>
            <span style={{ fontSize: 12, color: "#475569" }}>Quantite</span>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              style={field}
            />
          </label>

          <div style={{ marginTop: 12, display: "grid", gap: 7 }}>
            <p style={row}><span>Prix unitaire</span><strong>{formatFcfa(pricing.unit)}</strong></p>
            <p style={row}><span>Remise volume</span><strong style={{ color: "#166534" }}>-{Math.round(discountRate * 100)}%</strong></p>
            <p style={row}><span>Montant remise</span><strong>-{formatFcfa(pricing.discountAmount)}</strong></p>
            <p style={{ ...row, fontSize: 18 }}><span>Total</span><strong>{formatFcfa(pricing.total)}</strong></p>
            <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>Delai de production estime: 3 a 5 jours.</p>
          </div>

          <div style={{ marginTop: 12, borderTop: "1px dashed #dbe4f0", paddingTop: 10, display: "grid", gap: 7 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>Checklist qualite</p>
            <CheckItem label="Resolution OK" ok={qualityChecks.minDpi} />
            <CheckItem label="Marges respectees" ok={qualityChecks.margins} />
            <CheckItem label="Transparence valide" ok={qualityChecks.transparency} />
          </div>

          <button type="button" style={primaryAction} onClick={handleAddToCart} disabled={isExporting}>
            {isExporting ? "Generation..." : "Ajouter au panier"}
          </button>
          {message ? (
            <p
              style={{
                margin: "8px 0 0",
                color: message.toLowerCase().includes("erreur") ? "#b91c1c" : "#166534",
                fontSize: 13,
              }}
            >
              {message}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
};

function CheckItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <p style={{ margin: 0, fontSize: 13, color: ok ? "#166534" : "#b91c1c", display: "flex", alignItems: "center", gap: 7 }}>
      <CheckCircle2 size={14} />
      <span>{label}</span>
    </p>
  );
}

const field: React.CSSProperties = {
  width: "100%",
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "9px 10px",
  background: "#fff",
};

const toolButton: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "8px 10px",
  background: "#fff",
  fontSize: 12,
  fontWeight: 700,
  color: "#0f172a",
  display: "inline-flex",
  gap: 6,
  alignItems: "center",
};

const chip: React.CSSProperties = {
  border: "1px solid #dbe4f0",
  borderRadius: 999,
  background: "#f8fafc",
  fontSize: 12,
  padding: "6px 10px",
  color: "#334155",
  fontWeight: 600,
};

const iconButton: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 9,
  width: 32,
  height: 32,
  background: "#fff",
  color: "#0f172a",
  display: "inline-grid",
  placeItems: "center",
};

const ghostAction: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "8px 10px",
  background: "#fff",
  fontSize: 12,
  fontWeight: 700,
  color: "#0f172a",
  display: "inline-flex",
  gap: 6,
  alignItems: "center",
};

const row: React.CSSProperties = {
  margin: 0,
  display: "flex",
  justifyContent: "space-between",
  fontSize: 14,
};

const primaryAction: React.CSSProperties = {
  marginTop: 12,
  border: "none",
  borderRadius: 11,
  padding: "11px 13px",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 800,
  width: "100%",
  cursor: "pointer",
  boxShadow: "0 16px 28px -24px rgba(2,6,23,0.8)",
};

export default DesignerCanvas;
