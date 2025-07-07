import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, planName, price, currency, interval } = await request.json();

    // Validation
    if (!userId || !userEmail || !planName || !price || !currency || !interval) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or get the price ID for this plan
    let priceId: string;
    
    // Check if price already exists
    const existingPrices = await stripe.prices.list({
      active: true,
      limit: 100,
    });

    const existingPrice = existingPrices.data.find(
      price => 
        price.unit_amount === Math.round(Number(price) * 100) && // Convert to cents
        price.currency === currency &&
        price.recurring?.interval === interval
    );

    if (existingPrice) {
      priceId = existingPrice.id;
    } else {
      // Create new price
      const newPrice = await stripe.prices.create({
        unit_amount: Math.round(price * 100), // Convert to cents
        currency: currency,
        recurring: {
          interval: interval as 'day' | 'week' | 'month' | 'year',
        },
        product_data: {
          name: planName,
        },
      });
      priceId = newPrice.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/payment`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        planName: planName,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          planName: planName,
        },
      },
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 