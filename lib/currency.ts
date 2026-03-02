const EUR_TO_XOF = 655.957;

export function toFcfa(amountInEur: number): number {
  return Math.round(amountInEur * EUR_TO_XOF);
}

export function formatFcfa(amountInEur: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(toFcfa(amountInEur))} FCFA`;
}
