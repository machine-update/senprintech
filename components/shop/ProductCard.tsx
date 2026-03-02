"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatFcfa } from "@/lib/currency";

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isNew?: boolean;
  leadTimeDays?: number;
  image?: string;
};

export default function ProductCard(props: ProductCardProps) {
  const premiumImage = getPremiumImage(props.name, props.category, props.image);

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      <Link
        href={`/products/${props.id}`}
        style={{
          display: "block",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          overflow: "hidden",
          textDecoration: "none",
          color: "#0f172a",
          boxShadow: "0 10px 22px -18px rgba(2,6,23,0.36), 0 1px 2px rgba(15,23,42,0.08)",
          transition: "box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
        }}
      >
        <div
          style={{
            aspectRatio: "4 / 3",
            background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
            position: "relative",
            overflow: "hidden",
            display: "grid",
            placeItems: "center",
            padding: 12,
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              width: "76%",
              height: 22,
              bottom: 8,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at center, rgba(15,23,42,0.23), rgba(15,23,42,0))",
              filter: "blur(2px)",
            }}
            whileHover={{ opacity: 0.74, scale: 1.05 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <motion.img
            src={premiumImage}
            alt={props.name}
            loading="lazy"
            whileHover={{ scale: 1.028, y: -2 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 10,
              boxShadow: "0 14px 30px -24px rgba(2,6,23,0.42)",
              filter: "saturate(1.02) contrast(1.01)",
            }}
          />
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: 11,
              fontWeight: 700,
              color: "#0f172a",
              background: "rgba(255,255,255,0.9)",
              border: "1px solid #e2e8f0",
              borderRadius: 999,
              padding: "4px 8px",
            }}
          >
            Aperçu rapide
          </motion.span>
        </div>
        <div style={{ padding: "15px 14px 14px", display: "grid", gap: 9 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <p style={{ margin: 0, fontSize: 12, textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
              {props.category}
            </p>
            {props.isNew ? (
              <span
                style={{
                  fontSize: 11,
                  background: "#ecfdf3",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                  padding: "3px 8px",
                  borderRadius: 999,
                }}
              >
                Nouveau
              </span>
            ) : null}
          </div>
          <h3 style={{ margin: 0, fontSize: 19, lineHeight: 1.2 }}>{props.name}</h3>
          <p style={{ margin: 0, color: "#475569", minHeight: 42, fontSize: 14, lineHeight: 1.45 }}>{props.description}</p>
          <p style={{ margin: "2px 0 0", fontWeight: 900, fontSize: 24, color: "#061a3a", letterSpacing: -0.4 }}>{formatFcfa(props.price)}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Delai moyen: {props.leadTimeDays ?? 4} jours</p>
            <motion.span
              whileHover={{ y: -1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                background: "#0f172a",
                color: "#fff",
                borderRadius: 10,
                padding: "8px 10px",
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1,
                boxShadow: "0 8px 14px -12px rgba(2,6,23,0.78)",
              }}
            >
              Voir le produit
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function getPremiumImage(name: string, category: string, image: string | undefined): string {
  const nameKey = name.toLowerCase();
  const categoryKey = category.toLowerCase();

  // Use provided images only when they are external curated visuals.
  if (image && !image.startsWith("/")) return image;

  if (nameKey.includes("t-shirt") || nameKey.includes("shirt")) {
    return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80&fm=webp";
  }
  if (nameKey.includes("mug")) {
    return "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1400&q=80&fm=webp";
  }
  if (nameKey.includes("flyer")) {
    return "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1400&q=80&fm=webp";
  }
  if (nameKey.includes("kakemono") || nameKey.includes("roll-up") || nameKey.includes("roll up")) {
    return "https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=1400&q=80&fm=webp";
  }

  if (categoryKey.includes("vetement") || categoryKey.includes("textile")) {
    return "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1400&q=80&fm=webp";
  }
  if (categoryKey.includes("objet") || categoryKey.includes("goodie")) {
    return "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1400&q=80&fm=webp";
  }
  if (categoryKey.includes("flyer") || categoryKey.includes("print")) {
    return "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1400&q=80&fm=webp";
  }
  if (categoryKey.includes("support")) {
    return "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1400&q=80&fm=webp";
  }
  return "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1400&q=80&fm=webp";
}
