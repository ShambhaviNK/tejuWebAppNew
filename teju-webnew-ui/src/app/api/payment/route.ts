import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-06-30.basil'
})

export async function POST(request: NextRequest) {
  try {
    const { amount, description } = await request.json()

    if (!amount || amount < 50) { // Minimum 50 cents
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      )
    }

    if (!description) {
      return NextResponse.json(
        { error: 'Payment description is required' },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: 'usd',
      description: description,
      metadata: {
        timestamp: new Date().toISOString()
      }
    })

    return NextResponse.json(
      { 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
