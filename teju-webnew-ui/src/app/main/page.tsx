'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MainInterface from '../components/MainInterface'
import { Button } from '../components/MainInterface.styles'

export default function MainPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/login')
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth')
    router.push('/login')
  }

  const handlePayment = () => {
    router.push('/payment')
  }

  if (loading) {
    return (
      <div style={{ 
        background: '#1a1b21', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: '#ccc' }}>Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div style={{ background: '#1a1b21', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px',
        gap: '12px'
      }}>
        <Button onClick={handlePayment}>💳 Payment</Button>
        <Button $red onClick={handleLogout}>Logout</Button>
      </div>
      <MainInterface />
    </div>
  )
}
