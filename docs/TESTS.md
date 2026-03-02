# Checklist Tests

## Unitaires (suggestions)
- `lib/pricing.ts`
  - calcul prix optionnel
  - calcul taxes/remise/livraison
- validation coupon (`/api/coupons/validate`)
- contraintes upload (`/api/uploads`)

## Integration
- creation commande via `/api/orders`
- sauvegarde + chargement design (`/api/designs`)
- creation produit admin (`/api/admin/products`)

## E2E (Playwright suggestions)
1. Home -> catalogue -> produit -> add cart -> checkout -> order tracking
2. Designer: ajouter texte/image -> sauvegarder -> add cart
3. Admin: creer coupon -> appliquer coupon panier
4. Search: filtres categorie/prix/new + tri

## Non-fonctionnel
- Accessibilite: navigation clavier, labels formulaires, contrastes
- Performance: lazy loading images, payload API minimal
- Securite: validation server-side input, upload whitelist, RBAC middleware a ajouter
