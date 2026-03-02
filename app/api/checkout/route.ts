import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe'; // Mock ou réel

export async function POST(req: Request) {
  const body = await req.json();
  const { items } = body;

  try {
    // 1. Calculer le prix total côté serveur (sécurité)
    // 2. Créer une Session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/order-success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: 'Erreur lors du paiement' }, { status: 500 });
  }
}
