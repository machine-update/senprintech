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
2. Configurer `.env`
3. `npm run prisma:push`
4. `npx prisma db seed`
5. `npm run dev`

## Variables d'environnement Turso / Vercel
```env
DATABASE_URL=libsql://your-db-name.turso.io
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
NEXT_PUBLIC_URL=https://your-project.vercel.app
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=replace-with-a-long-random-secret
STRIPE_SECRET_KEY=sk_test_placeholder
```

`DATABASE_URL` peut pointer vers Turso au runtime. Sans variable distante, `npm run prisma:push` initialise automatiquement `file:./prisma/dev.db` en local.

## Bootstrap Turso
1. Exporter `TURSO_DATABASE_URL` et `TURSO_AUTH_TOKEN`
2. Lancer `npm run turso:bootstrap`

`npm run turso:init` applique le schema SQLite compatible Turso contenu dans `prisma/turso-init.sql`, puis `npm run prisma:seed` injecte les donnees de demo via l'adapter Turso.

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
