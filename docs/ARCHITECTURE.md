# Architecture

## Couches
- `app/*`: pages UI et routes API (App Router)
- `components/*`: UI reusable (shop/designer/admin/shared)
- `lib/*`: logique metier (pricing, mocks, prisma)
- `store/*`: Zustand (cart + designer)
- `prisma/*`: schema + seed

## Routes cibles MVP
- Shop: home, catalogue, search, product, design, cart, checkout, order tracking
- User: account
- Business: business offers + quotes listing
- Admin: dashboard + orders + products + customers + promos
- Support/legal: help/contact/legal

## Schema Prisma (high-level)
- Core user/auth: `User`, `Address`
- Catalogue: `Category`, `Product`, `Variant`, `Option`, `OptionValue`, `ProductFaq`, `Review`
- Designer: `Design`, `UploadedFile`
- Commandes: `Order`, `OrderItem`, `TrackingEvent`
- Marketing: `Coupon`
- B2B: `BusinessQuote`

## Roles (RBAC)
- `USER`: navigation shop + compte + commandes + designs
- `BUSINESS`: fonctionnalites user + devis volume
- `ADMIN`: back-office (produits, commandes, clients, promos)

