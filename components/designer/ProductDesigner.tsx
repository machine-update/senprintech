"use client";

import { useMemo } from "react";
import { useDesignerStore } from "@/store/use-designer-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Type, ImagePlus, Trash2 } from "lucide-react";

type ProductInput = {
  name: string;
  images?: string[];
};

export default function ProductDesigner({ product }: { product: ProductInput }) {
  const { elements, addElement, selectedElementId, setSelectedElement, updateElement, removeElement } = useDesignerStore();

  const selected = useMemo(() => elements.find((e) => e.id === selectedElementId), [elements, selectedElementId]);

  const addText = () => {
    addElement({
      id: crypto.randomUUID(),
      type: "text",
      content: "Nouveau texte",
      x: 50,
      y: 60,
      fontSize: 24,
      fill: "#111827",
      rotation: 0,
    });
  };

  function onUploadImage(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    addElement({
      id: crypto.randomUUID(),
      type: "image",
      content: url,
      x: 80,
      y: 120,
      width: 110,
      height: 110,
      rotation: 0,
    });
  }

  return (
    <div className="flex h-[560px] bg-slate-50 rounded-xl overflow-hidden border">
      <div className="w-24 bg-white border-r flex flex-col items-center py-4 gap-4">
        <Button variant="outline" size="icon" onClick={addText} aria-label="Ajouter texte">
          <Type className="w-5 h-5" />
        </Button>
        <label className="cursor-pointer border border-slate-300 rounded-md p-2 hover:bg-slate-50" aria-label="Importer image">
          <ImagePlus className="w-5 h-5" />
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            className="hidden"
            onChange={(e) => onUploadImage(e.target.files?.[0])}
          />
        </label>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="relative w-[400px] h-[500px] bg-white shadow-2xl border-2 border-dashed border-slate-200">
          <img
            src={product.images?.[0] ?? ""}
            alt={product.name ?? "Aperçu du produit"}
            className="absolute inset-0 w-full h-full object-contain opacity-20 pointer-events-none"
          />

          {elements.map((el) => (
            <div
              key={el.id}
              onClick={() => setSelectedElement(el.id)}
              style={{
                position: "absolute",
                left: el.x,
                top: el.y,
                transform: `rotate(${el.rotation}deg)`,
                color: el.fill,
                fontSize: `${el.fontSize ?? 16}px`,
                cursor: "move",
                border: selectedElementId === el.id ? "2px solid #3b82f6" : "none",
                width: el.width,
                height: el.height,
              }}
              draggable
              onDragEnd={(e) => {
                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                if (rect) {
                  updateElement(el.id, { x: e.clientX - rect.left, y: e.clientY - rect.top });
                }
              }}
            >
              {el.type === "image" ? (
                <img src={el.content} alt="visuel" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                el.content
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-72 bg-white border-l p-4">
        <h3 className="font-bold mb-4 uppercase text-xs text-slate-500">Proprietes</h3>
        {selected ? (
          <div className="space-y-3">
            {selected.type === "text" ? (
              <Input value={selected.content} onChange={(e) => updateElement(selected.id, { content: e.target.value })} />
            ) : null}
            <label className="block text-sm">
              Couleur texte
              <input
                type="color"
                value={selected.fill ?? "#111827"}
                onChange={(e) => updateElement(selected.id, { fill: e.target.value })}
                className="mt-1 block"
              />
            </label>
            <label className="block text-sm">
              Taille
              <input
                type="range"
                min={12}
                max={96}
                value={selected.fontSize ?? 16}
                onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) })}
                className="w-full"
              />
            </label>
            <label className="block text-sm">
              Rotation
              <input
                type="range"
                min={0}
                max={360}
                value={selected.rotation}
                onChange={(e) => updateElement(selected.id, { rotation: Number(e.target.value) })}
                className="w-full"
              />
            </label>
            <Button variant="outline" onClick={() => removeElement(selected.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Supprimer
            </Button>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Selectionnez un element pour le modifier</p>
        )}
      </div>
    </div>
  );
}
