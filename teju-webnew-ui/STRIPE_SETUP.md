# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payments for Teju Web after user sign-up.

## 🚀 Step 1: Create a Stripe Account

1. **Visit Stripe**: Go to [https://stripe.com](https://stripe.com)
2. **Sign Up**: Create a new account or sign in
3. **Complete Setup**: Follow the onboarding process

## 🔑 Step 2: Get Your API Keys

1. **Go to Dashboard**: In your Stripe dashboard, click "Developers" → "API keys"
2. **Copy Keys**: You'll need two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

## ⚙️ Step 3: Configure Environment Variables

1. **Update `.env.local`**: Add these variables to your `.env.local` file:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

2. **Replace Values**: 
   - Replace `pk_test_your_publishable_key_here` with your actual publishable key
   - Replace `sk_test_your_secret_key_here` with your actual secret key
   - We'll set up the webhook secret in the next step

## 🔗 Step 4: Set Up Webhooks

1. **Go to Webhooks**: In Stripe dashboard, click "Developers" → "Webhooks"
2. **Add Endpoint**: Click "Add endpoint"
3. **Endpoint URL**: For development, use:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
   For local testing, you can use ngrok or similar tools.
4. **Select Events**: Choose these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Copy Webhook Secret**: After creating, copy the webhook signing secret and add it to your `.env.local`

## 🧪 Step 5: Test the Integration

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test the Flow**:
   - Go to `/auth`
   - Sign up for a new account
   - You'll be redirected to `/payment`
   - Click "Start Free Trial" to test Stripe checkout

3. **Use Test Cards**: Stripe provides test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits

## 📊 Step 6: Monitor Payments

### View Data in Stripe Dashboard:
1. **Payments**: View all successful payments
2. **Customers**: See customer information
3. **Subscriptions**: Track subscription status
4. **Webhooks**: Monitor webhook deliveries

## 🚀 Step 7: Production Deployment

### For Vercel Deployment:
1. **Add Environment Variables**: In your Vercel dashboard, add the same environment variables
2. **Update Webhook URL**: Change webhook endpoint to your production domain
3. **Switch to Live Keys**: Replace test keys with live keys

### Environment Variables for Production:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Stripe publishable key is not set"**:
   - Check your environment variables
   - Ensure the key starts with `pk_test_` or `pk_live_`

2. **"Webhook signature verification failed"**:
   - Verify your webhook secret
   - Check that webhook URL is correct

3. **"Payment failed"**:
   - Use test card numbers for testing
   - Check Stripe dashboard for error details

### Debug Steps:
1. **Check Stripe Logs**: Dashboard → Logs
2. **Verify Webhooks**: Dashboard → Webhooks → Endpoints
3. **Test API Keys**: Use Stripe's API testing tools

## 💡 Features Included

### Payment Page (`/payment`):
- **Single Plan**: $19.99/month subscription
- **Beautiful UI**: Modern, responsive design
- **Skip Option**: Users can skip payment
- **Stripe Checkout**: Secure payment processing

### Webhook Handler:
- **Payment Success**: Logs successful payments
- **Subscription Events**: Tracks subscription changes
- **Error Handling**: Graceful error management

### Integration Points:
- **After Sign-up**: Redirects to payment page
- **After Payment**: Redirects to onboarding
- **Success Message**: Shows payment confirmation

## 🎉 Success!

Your Teju Web application now has a complete payment flow! Users can:
1. Sign up for an account
2. Choose to subscribe or skip payment
3. Complete secure payment via Stripe
4. Continue to onboarding and main app

---

**Need Help?**
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Next.js Documentation](https://nextjs.org/docs) 