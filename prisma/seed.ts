import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  await prisma.trackingEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.design.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productFaq.deleteMany();
  await prisma.optionValue.deleteMany();
  await prisma.option.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.uploadedFile.deleteMany();
  await prisma.businessQuote.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  const [user, businessUser, adminUser] = await Promise.all([
    prisma.user.create({ data: { email: "client@senprintech.com", password: hashPassword("demo"), name: "Client Demo", role: "USER" } }),
    prisma.user.create({ data: { email: "biz@senprintech.com", password: hashPassword("demo"), name: "Business Demo", role: "BUSINESS", companyName: "Studio Nova", vatNumber: "FR123456789" } }),
    prisma.user.create({ data: { email: "admin@senprintech.com", password: hashPassword("demo"), name: "Admin", role: "ADMIN" } }),
  ]);

  await prisma.address.createMany({
    data: [
      {
        userId: user.id,
        label: "Domicile",
        fullName: "Client Demo",
        line1: "10 rue des Ateliers",
        city: "Paris",
        postalCode: "75011",
        country: "France",
        isDefault: true,
      },
      {
        userId: businessUser.id,
        label: "Siege",
        fullName: "Studio Nova",
        line1: "90 avenue de la Republique",
        city: "Lyon",
        postalCode: "69002",
        country: "France",
      },
    ],
  });

  const [clothing, print, graphics, objects] = await Promise.all([
    prisma.category.create({ data: { name: "Vetements", slug: "vetements", description: "Textile personnalise" } }),
    prisma.category.create({ data: { name: "Flyers", slug: "flyers", description: "Supports print marketing" } }),
    prisma.category.create({ data: { name: "Supports Graphiques", slug: "supports-graphiques", description: "Baches, affiches, kakemonos" } }),
    prisma.category.create({ data: { name: "Objets", slug: "objets", description: "Goodies personnalises" } }),
  ]);

  const tshirt = await prisma.product.create({
    data: {
      slug: "tshirt-coton-bio-premium",
      name: "T-Shirt Coton Bio Premium",
      shortDesc: "Impression DTG haute precision",
      description: "T-shirt 180g, coupe moderne, textile bio certifie, ideal marques et equipes.",
      guide: "Formats recommandes: PNG transparent 300 DPI, zone max 30x40 cm.",
      basePrice: 19.9,
      images: ["/products/tshirt-white.jpg"],
      categoryId: clothing.id,
      isCustomizable: true,
      isNew: true,
      popularity: 95,
      leadTimeDays: 4,
      stockStatus: "IN_STOCK",
      variants: {
        create: [
          { name: "Regular", priceSurge: 0 },
          { name: "Oversize", priceSurge: 3 },
        ],
      },
      options: {
        create: [
          {
            name: "Taille",
            values: { create: [{ label: "S" }, { label: "M" }, { label: "L" }, { label: "XL", priceSurge: 2.5 }] },
          },
          {
            name: "Couleur",
            values: { create: [{ label: "Blanc" }, { label: "Noir", priceSurge: 1 }, { label: "Navy", priceSurge: 1 }] },
          },
          {
            name: "Impression",
            values: { create: [{ label: "Recto" }, { label: "Recto/Verso", priceSurge: 4 }] },
          },
        ],
      },
      faqs: {
        create: [
          { question: "Quel format de fichier envoyer ?", answer: "PNG transparent ou SVG vectoriel." },
          { question: "Quel delai moyen ?", answer: "Production 3-5 jours ou express 48h." },
        ],
      },
      reviews: {
        create: [
          { author: "Nadia", rating: 5, title: "Qualite top", body: "Impression nette, livraison rapide." },
          { author: "Hugo", rating: 4, title: "Bon rapport qualite/prix", body: "Bonne tenue apres lavage." },
        ],
      },
    },
  });

  const flyer = await prisma.product.create({
    data: {
      slug: "flyers-a5-evenementiel",
      name: "Flyers A5 Evenementiel",
      shortDesc: "Offset premium 250g",
      description: "Flyers brillance elevee pour campagnes marketing et events.",
      guide: "PDF CMJN, fond perdu 3 mm, 300 DPI minimum.",
      basePrice: 45,
      images: ["/products/flyer-mockup.jpg"],
      categoryId: print.id,
      isCustomizable: true,
      popularity: 84,
      leadTimeDays: 3,
      stockStatus: "IN_STOCK",
      options: {
        create: [
          {
            name: "Quantite",
            values: { create: [{ label: "100 ex" }, { label: "500 ex", priceSurge: 40 }, { label: "1000 ex", priceSurge: 75 }] },
          },
          {
            name: "Finition",
            values: { create: [{ label: "Mat" }, { label: "Brillant", priceSurge: 6 }] },
          },
        ],
      },
      faqs: {
        create: [{ question: "Acceptez-vous les fichiers Canva ?", answer: "Oui si export PDF HD avec traits de coupe." }],
      },
      reviews: {
        create: [{ author: "Agence 21", rating: 5, title: "Tres bon rendu", body: "Couleurs fideles et livraison en 72h." }],
      },
    },
  });

  const banner = await prisma.product.create({
    data: {
      slug: "kakemono-eco-85x200",
      name: "Kakemono ECO 85x200",
      shortDesc: "Stand roll-up pro",
      description: "Structure alu + visuel HD pour salons et boutiques.",
      guide: "PDF 85x200 cm, zones de securite respectees.",
      basePrice: 79,
      images: ["/products/kakemono.jpg"],
      categoryId: graphics.id,
      isCustomizable: true,
      popularity: 72,
      leadTimeDays: 5,
      stockStatus: "LOW_STOCK",
      options: {
        create: [
          { name: "Type", values: { create: [{ label: "Standard" }, { label: "Premium", priceSurge: 24 }] } },
        ],
      },
    },
  });

  const mug = await prisma.product.create({
    data: {
      slug: "mug-ceramique-blanc",
      name: "Mug Ceramique Blanc",
      shortDesc: "Goodie best seller",
      description: "Mug 325 ml compatible lave-vaisselle, personnalisation couleur.",
      guide: "Visuel PNG 2000x900 minimum pour impression panoramique.",
      basePrice: 12,
      images: ["/products/mug.jpg"],
      categoryId: objects.id,
      isCustomizable: true,
      isNew: true,
      popularity: 90,
      leadTimeDays: 4,
      stockStatus: "IN_STOCK",
      options: {
        create: [
          { name: "Couleur interieur", values: { create: [{ label: "Blanc" }, { label: "Rouge", priceSurge: 1.5 }, { label: "Noir", priceSurge: 1.5 }] } },
        ],
      },
    },
  });

  await prisma.coupon.createMany({
    data: [
      { code: "WELCOME10", type: "PERCENT", value: 10, minAmount: 30, active: true },
      { code: "PRO25", type: "FIXED", value: 25, minAmount: 200, active: true },
    ],
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PRODUCTION",
      total: 63.78,
      taxAmount: 10.63,
      shippingPrice: 4.9,
      discountAmount: 0,
      shippingMethod: "Standard 72h",
      paymentMethod: "CARD",
      shippingAddress: {
        fullName: "Client Demo",
        line1: "10 rue des Ateliers",
        city: "Paris",
        postalCode: "75011",
        country: "France",
      },
      items: {
        create: [
          {
            productId: tshirt.id,
            productName: tshirt.name,
            quantity: 2,
            unitPrice: 21.9,
            optionSnapshot: { Taille: "M", Couleur: "Noir", Impression: "Recto" },
          },
        ],
      },
      events: {
        create: [
          { status: "PAID", label: "Paiement confirme" },
          { status: "PRODUCTION", label: "En atelier impression" },
        ],
      },
    },
  });

  await prisma.design.create({
    data: {
      name: "Design Team Event",
      userId: user.id,
      productId: tshirt.id,
      canvasData: {
        width: 1080,
        height: 1080,
        elements: [
          { id: "txt-1", type: "text", content: "TEAM 2026", x: 120, y: 180, fill: "#111827", fontSize: 48 },
          { id: "img-1", type: "image", content: "/uploads/logo-demo.png", x: 240, y: 320, width: 300, height: 300 },
        ],
      },
      previewUrl: "/mock/design-preview-team.png",
      qualityChecks: {
        minDpi: true,
        outOfBounds: false,
        transparentBackground: true,
      },
    },
  });

  await prisma.businessQuote.create({
    data: {
      userId: businessUser.id,
      companyName: "Studio Nova",
      email: businessUser.email,
      phone: "+33 6 12 00 00 00",
      quantity: 500,
      notes: "Besoin de polos + flyers pour salon pro Lyon.",
      status: "IN_REVIEW",
    },
  });

  console.log("Seed premium acheve avec succes", {
    users: [user.email, businessUser.email, adminUser.email],
    products: [tshirt.slug, flyer.slug, banner.slug, mug.slug],
    orderId: order.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
