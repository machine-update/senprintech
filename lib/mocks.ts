import { OrderStatus } from "@prisma/client";

export const uspItems = [
  { title: "Qualite atelier", subtitle: "Controle colorimetrique et impression HD" },
  { title: "Livraison fiable", subtitle: "Suivi transporteur et delais clairs" },
  { title: "Support expert", subtitle: "SAV reactif pour particuliers et pros" },
];

export const reviewHighlights = [
  { author: "Mina", text: "Service pro, rendu premium, commande recue en 3 jours.", rating: 5 },
  { author: "Agence Atlas", text: "Top pour campagnes salon et objets brandes.", rating: 5 },
  { author: "Luca", text: "Designer simple et efficace, zero friction.", rating: 4 },
];

export const orderTimelineLabels: Record<OrderStatus, string> = {
  PENDING: "Commande en attente",
  PAID: "Paiement confirme",
  PRODUCTION: "En production",
  SHIPPED: "Expediee",
  DELIVERED: "Livree",
  CANCELLED: "Annulee",
};
