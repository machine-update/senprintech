# API Endpoints

## Public shop
- `GET /api/products`
  - query: `q`, `category`, `max`
  - return: liste produits avec options/categorie

- `POST /api/orders`
  - body: `{ items, shippingMethod, paymentMethod, shippingAddress, userEmail }`
  - action: cree commande + items + event `PAID`
  - return: `{ order, payment: { provider: "mock" } }`

- `GET /api/orders/[id]`
  - return: commande + timeline de tracking

- `POST /api/coupons/validate`
  - body: `{ code, amount }`
  - return: `{ valid, discountAmount }`

- `POST /api/uploads`
  - multipart form-data `file`
  - validations: type/poids
  - return: mock storage key + scan result

## Designer
- `GET /api/designs`
  - return: designs utilisateur mock
- `POST /api/designs`
  - body: `{ name, productId, canvasData, previewUrl, qualityChecks }`
  - return: design cree
- `GET /api/designs/[id]`
- `PUT /api/designs/[id]`

## Admin
- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/promos`
- `POST /api/admin/promos`

## Checkout flow
1. Panier client (`zustand`)
2. `/checkout` collecte adresse + livraison + paiement
3. POST `/api/orders`
4. Redirection suivi `/orders/[id]`

## Designer flow
1. Produit -> designer
2. edition texte/images
3. sauvegarde via POST `/api/designs`
4. ajout panier avec `designId`
5. commande associee au design

