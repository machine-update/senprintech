import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { computeTotals, estimateShipping } from "@/lib/pricing";
import { authOptions } from "@/lib/auth";

type CartItemPayload = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  options: Record<string, string>;
  designId?: string;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const body = await req.json();
  const items = (body.items ?? []) as CartItemPayload[];

  if (!items.length) {
    return NextResponse.json({ error: "Panier vide" }, { status: 400 });
  }

  const shippingMethod = body.shippingMethod ?? "standard";
  const shipping = estimateShipping(items.reduce((acc, item) => acc + item.price * item.quantity, 0), shippingMethod);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totals = computeTotals({ subtotal, shipping, discount: 0 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PAID",
      total: totals.total,
      taxAmount: totals.taxes,
      shippingPrice: totals.shipping,
      discountAmount: totals.discount,
      paymentMethod: body.paymentMethod ?? "card",
      shippingMethod,
      shippingAddress: body.shippingAddress ?? {},
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          customDesignId: item.designId,
          optionSnapshot: item.options,
        })),
      },
      events: {
        create: [{ status: "PAID", label: "Paiement confirme" }],
      },
    },
    include: { items: true, events: true },
  });

  return NextResponse.json({
    order,
    payment: {
      provider: "mock",
      message: "Stripe-ready: remplacer ici par creation PaymentIntent/CheckoutSession.",
    },
  });
}
