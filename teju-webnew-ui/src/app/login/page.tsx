'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Title, Button, InputArea } from '../components/MainInterface.styles'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    if (username === 'admin' && password === '1234') {
      localStorage.setItem('auth', 'true')
      router.push('/main')
    } else {
      setError('Invalid credentials')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div style={{ background: '#1a1b21', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div></div>
        <Button onClick={() => router.push('/signup')}>Sign Up</Button>
      </div>
      <Container>
        <Title>Welcome Back</Title>
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
        <InputArea
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          onKeyPress={handleKeyPress}
        />
        <InputArea
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleLogin}>Login</Button>
        <p style={{ color: '#ccc', textAlign: 'center', marginTop: '20px' }}>
          Don&apos;t have an account?{' '}
          <span 
            style={{ color: '#2196f3', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => router.push('/signup')}
          >
            Sign up
          </span>
        </p>
      </Container>
    </div>
  )
}
