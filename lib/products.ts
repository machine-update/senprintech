type ProductWithImages = {
  images: unknown;
};

export function parseProductImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.length > 0);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      return parseProductImages(JSON.parse(trimmed));
    } catch {
      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

export function normalizeProduct<T extends ProductWithImages>(product: T): Omit<T, "images"> & { images: string[] } {
  return {
    ...product,
    images: parseProductImages(product.images),
  };
}

export function normalizeProducts<T extends ProductWithImages>(products: T[]): Array<Omit<T, "images"> & { images: string[] }> {
  return products.map(normalizeProduct);
}
