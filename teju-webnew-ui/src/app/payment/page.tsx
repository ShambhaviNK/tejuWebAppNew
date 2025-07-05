'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Container, Title, Button, InputArea, ButtonRow, SmallButton } from '../components/MainInterface.styles'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [amount, setAmount] = useState('10.00')
  const [description, setDescription] = useState('Premium Subscription')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet')
      setLoading(false)
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Card element not found')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          description
        })
      })

      const { clientSecret } = await response.json()

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name'
          }
        }
      })

      if (result.error) {
        setError(result.error.message || 'Payment failed')
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/main')
        }, 2000)
      }
    } catch {
      setError('Payment processing failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Container>
        <Title>Payment Successful!</Title>
        <div style={{ 
          color: '#22c55e', 
          textAlign: 'center', 
          fontSize: '1.2rem', 
          marginBottom: '20px' 
        }}>
          ✓ Your payment has been processed successfully
        </div>
        <p style={{ color: '#ccc', textAlign: 'center' }}>
          Redirecting to main page...
        </p>
      </Container>
    )
  }

  return (
    <Container>
      <Title>Complete Your Payment</Title>
      {error && (
        <div style={{ 
          color: '#fff', 
          background: '#e53935', 
          borderRadius: '6px', 
          padding: '10px 16px', 
          margin: '12px 0', 
          width: '100%', 
          textAlign: 'center' 
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <InputArea
          type="number"
          step="0.01"
          min="0.50"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount ($)"
          required
        />
        
        <InputArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Payment description"
          required
        />

        <div style={{ 
          background: '#23242a', 
          border: '2px solid #333', 
          borderRadius: '8px', 
          padding: '12px', 
          margin: '12px 0' 
        }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ccc',
                  '::placeholder': {
                    color: '#666',
                  },
                },
                invalid: {
                  color: '#e53935',
                },
              },
            }}
          />
        </div>

        <ButtonRow>
          <SmallButton 
            type="button" 
            onClick={() => router.push('/main')}
            disabled={loading}
          >
            Cancel
          </SmallButton>
          <SmallButton 
            type="submit" 
            $green 
            disabled={!stripe || loading}
          >
            {loading ? 'Processing...' : `Pay $${amount}`}
          </SmallButton>
        </ButtonRow>
      </form>

      <div style={{ 
        color: '#666', 
        fontSize: '0.9rem', 
        textAlign: 'center', 
        marginTop: '20px' 
      }}>
        <p>Test card: 4242 4242 4242 4242</p>
        <p>Use any future date and any 3-digit CVC</p>
      </div>
    </Container>
  )
}

export default function PaymentPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/login')
    }
  }, [router])

  if (!isAuthenticated) {
    return (
      <div style={{ background: '#1a1b21', minHeight: '100vh', padding: '20px' }}>
        <Container>
          <Title>Redirecting to Login...</Title>
        </Container>
      </div>
    )
  }

  return (
    <div style={{ background: '#1a1b21', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Button onClick={() => router.push('/main')}>← Back to Main</Button>
        <Button 
          $red 
          onClick={() => {
            localStorage.removeItem('auth')
            router.push('/login')
          }}
        >
          Logout
        </Button>
      </div>
      
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  )
}
