"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (you'll need to add your publishable key to .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PLAN = {
  name: "Teju Web Premium",
  price: 19.99,
  currency: "USD",
  interval: "month",
  features: [
    "Unlimited conversations",
    "Advanced speech recognition",
    "Personalized responses",
    "Access to all features"
  ]
};

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth');
      return;
    }
    
    try {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    } catch {
      router.push('/auth');
    }
  }, [router]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          userEmail: user?.email,
          planName: PLAN.name,
          price: PLAN.price,
          currency: PLAN.currency,
          interval: PLAN.interval
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        setError(error);
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          setError(stripeError.message || 'Payment failed');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip payment and go to onboarding
    router.push('/onboarding');
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#23242a',
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #23242a 0%, #181920 100%)",
      padding: 20,
    }}>
      <div style={{
        background: "rgba(34, 36, 44, 0.98)",
        borderRadius: 20,
        padding: "44px 32px 32px 32px",
        maxWidth: 480,
        width: "100%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 1.5px 0 rgba(255,255,255,0.04)",
        border: "1.5px solid #292a33",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", width: "100%" }}>
          <h1 style={{ 
            color: "#fff", 
            fontSize: "1.8rem", 
            fontWeight: 700, 
            marginBottom: 8,
            letterSpacing: "-0.5px"
          }}>
            Welcome to Teju Web! 🎉
          </h1>
          <p style={{ 
            color: "#ccc", 
            fontSize: "1.1rem", 
            marginBottom: 16,
            lineHeight: 1.5
          }}>
            Hi {user.name}, let&apos;s get you started with the best communication experience.
          </p>
        </div>

        {/* Plan Card */}
        <div style={{
          background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
          borderRadius: 16,
          padding: "32px 24px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }} />
          <div style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }} />
          
          <h2 style={{ 
            color: "#fff", 
            fontSize: "1.5rem", 
            fontWeight: 700, 
            marginBottom: 8,
            position: "relative",
            zIndex: 1
          }}>
            {PLAN.name}
          </h2>
          
          <div style={{ 
            color: "#fff", 
            fontSize: "2.5rem", 
            fontWeight: 700, 
            marginBottom: 4,
            position: "relative",
            zIndex: 1
          }}>
            ${PLAN.price}
            <span style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.8 }}>
              /{PLAN.interval}
            </span>
          </div>
          
          <p style={{ 
            color: "rgba(255,255,255,0.9)", 
            fontSize: "1rem", 
            marginBottom: 24,
            position: "relative",
            zIndex: 1
          }}>
            Start your Subscription today
          </p>
        </div>

        {/* Features */}
        <div style={{ width: "100%" }}>
          <h3 style={{ 
            color: "#fff", 
            fontSize: "1.2rem", 
            fontWeight: 600, 
            marginBottom: 16,
            textAlign: "center"
          }}>
            What&apos;s included:
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PLAN.features.map((feature, index) => (
              <div key={index} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#fff",
                fontSize: "1rem"
              }}>
                <div style={{
                  width: 20,
                  height: 20,
                  background: "#22c55e",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: "bold" }}>✓</span>
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ 
            background: "rgba(229, 57, 53, 0.13)", 
            border: "1.5px solid #e53935", 
            color: "#e53935", 
            padding: "12px 16px", 
            borderRadius: 7, 
            fontSize: "1rem", 
            textAlign: "center",
            width: "100%"
          }}>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 12, 
          width: "100%",
          marginTop: 8
        }}>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              background: "linear-gradient(90deg, #2196f3 60%, #21cbf3 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: "1.1rem",
              padding: "16px 24px",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
              transition: "all 0.2s",
              boxShadow: "0 4px 16px rgba(33,150,243,0.3)",
            }}
          >
            {loading ? "Processing..." : `Start Subscription - $${PLAN.price}/${PLAN.interval}`}
          </button>
          
          <button
            onClick={handleSkip}
            disabled={loading}
            style={{
              background: "transparent",
              color: "#ccc",
              border: "1.5px solid #444",
              borderRadius: 12,
              fontWeight: 500,
              fontSize: "1rem",
              padding: "14px 24px",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
              transition: "all 0.2s",
            }}
          >
            Free Demo Trial
          </button>
        </div>

        {/* Security Notice */}
        <div style={{ 
          textAlign: "center", 
          color: "#888", 
          fontSize: "0.9rem",
          marginTop: 16,
          lineHeight: 1.4
        }}>
          🔒 Secure payment powered by Stripe<br />
          Cancel anytime • No commitment required
        </div>
      </div>
    </div>
  );
} 