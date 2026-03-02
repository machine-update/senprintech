# SenPrinTech - Plateforme e-commerce premium

SenPrinTech est une base MVP complete pour la personnalisation et l'impression:
- catalogue multi-categories (vetements, flyers, supports graphiques, objets)
- fiches produits detaillees avec options/prix dynamique
- designer integre (texte/image, zones guidees, sauvegarde design)
- panier, checkout, suivi commande
- espace client + espace entreprise
- back-office admin (produits, commandes, clients, promos)

## Stack
- Next.js App Router + TypeScript
- Prisma + PostgreSQL
- Zustand (cart/designer)
- APIs Next.js Route Handlers
- Stripe ready (mock en dev)

## Lancement local
1. `npm install`
2. Configurer `.env` (DATABASE_URL)
3. `npx prisma db push`
4. `npx prisma db seed`
5. `npm run dev`

## Routes principales
- `/` home premium
- `/catalogue` catalogue
- `/search` recherche + filtres
- `/products/[id]` fiche produit + configurateur
- `/design` designer avance
- `/cart` panier
- `/checkout` checkout multi-etapes
- `/orders/[id]` suivi commande
- `/account` espace client
- `/business` espace entreprise
- `/admin` dashboard admin
- `/admin/orders` gestion commandes
- `/admin/products` CRUD produits
- `/admin/customers` clients/entreprises
- `/admin/promos` coupons
- `/help`, `/contact`, `/legal`

## Mocks extensibles
- Paiement mock (`/api/orders`) avec message Stripe-ready
- Upload mock securise (`/api/uploads`)
- Tracking commande (`TrackingEvent`)
- Coupons (`/api/coupons/validate`)

## Documentation detaillee
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/TESTS.md`
