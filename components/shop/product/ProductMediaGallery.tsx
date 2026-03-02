"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ProductMediaGalleryProps = {
  name: string;
  images: string[];
};

const fallbackImage =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80";

export default function ProductMediaGallery({ name, images }: ProductMediaGalleryProps) {
  const media = images.length ? images : [fallbackImage];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid #dbe4f0",
          background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
          minHeight: 460,
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={media[activeIndex]}
            src={media[activeIndex]}
            alt={`${name} visuel ${activeIndex + 1}`}
            initial={{ opacity: 0.2, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
            style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 460 }}
          />
        </AnimatePresence>
        <div
          style={{
            position: "absolute",
            left: 14,
            bottom: 14,
            fontSize: 12,
            color: "#e2e8f0",
            background: "rgba(15,23,42,0.72)",
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: 999,
            padding: "6px 10px",
          }}
        >
          Aperçu HD en temps réel
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
        {media.slice(0, 8).map((image, index) => {
          const active = index === activeIndex;
          return (
            <motion.button
              key={`${image}-${index}`}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveIndex(index)}
              style={{
                border: active ? "2px solid #1d4ed8" : "1px solid #dbe4f0",
                background: "#fff",
                padding: 0,
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
              }}
              aria-label={`Voir image ${index + 1}`}
            >
              <img src={image} alt={`${name} miniature ${index + 1}`} style={{ width: "100%", height: 82, objectFit: "cover" }} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
