'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('auth') === 'true'
    if (isLoggedIn) {
      router.push('/main')
    } else {
      router.push('/login')
    }
  }, [router])

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
