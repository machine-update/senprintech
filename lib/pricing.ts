export type SelectedOptions = Record<string, string>;

export type ProductOptionValue = {
  label: string;
  priceSurge: number;
};

export type ProductOption = {
  name: string;
  values: ProductOptionValue[];
};

export function calculateProductPrice(basePrice: number, options: ProductOption[], selected: SelectedOptions): number {
  const surges = options.reduce((acc, option) => {
    const selectedLabel = selected[option.name];
    if (!selectedLabel) return acc;
    const match = option.values.find((v) => v.label === selectedLabel);
    return acc + (match?.priceSurge ?? 0);
  }, 0);

  return Number((basePrice + surges).toFixed(2));
}

export function computeTotals(params: {
  subtotal: number;
  shipping: number;
  discount: number;
  taxRate?: number;
}) {
  const taxRate = params.taxRate ?? 0.2;
  const taxableBase = Math.max(params.subtotal - params.discount + params.shipping, 0);
  const taxes = Number((taxableBase * taxRate).toFixed(2));
  const total = Number((taxableBase + taxes).toFixed(2));

  return {
    subtotal: Number(params.subtotal.toFixed(2)),
    shipping: Number(params.shipping.toFixed(2)),
    discount: Number(params.discount.toFixed(2)),
    taxes,
    total,
  };
}

export function estimateShipping(subtotal: number, method: string): number {
  if (method === "express") return 14.9;
  if (method === "pickup") return 0;
  if (subtotal >= 100) return 0;
  return 6.9;
}
