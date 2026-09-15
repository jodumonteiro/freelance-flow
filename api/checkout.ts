import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-08-27.acacia' as any,
});

export default async function handler(req: VercelRequest, reqRes: VercelResponse) {
  if (req.method !== 'POST') {
    return reqRes.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType, customerEmail } = req.body;

    // Substitui pelos Price IDs reais gerados no teu painel do Stripe
    const priceId = planType === 'growth' 
      ? 'price_1MxYzID_growth_id_here' 
      : 'price_1MxYzID_starter_id_here';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://freelance-flow.vercel.app/dashboard?success=true`,
      cancel_url: `https://freelance-flow.vercel.app/dashboard?canceled=true`,
    });

    return reqRes.status(200).json({ url: session.url });
  } catch (error: any) {
    return reqRes.status(500).json({ error: error.message });
  }
}