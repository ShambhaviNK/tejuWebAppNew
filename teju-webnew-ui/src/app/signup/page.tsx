'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Title, Button, InputArea, ButtonRow, SmallButton } from '../components/MainInterface.styles'

export default function SignupPage() {
  const [signupStep, setSignupStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    username: '',
    likedFoods: '',
    likedPeople: '',
    likedActivities: '',
    dislikedFoods: '',
    dislikedActivities: ''
  })
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = (nextStep: number) => {
    setError('')
    const form = formRef.current
    if (form && form.checkValidity()) {
      setSignupStep(nextStep)
    } else {
      form?.reportValidity()
    }
  }

  const handleSignup = async () => {
    setError('')
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        localStorage.setItem('auth', 'true')
        router.push('/main')
      } else {
        setError('Signup failed. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
  }

  const renderSignupForm = () => {
    switch(signupStep) {
      case 1:
        return (
          <form ref={formRef}>
            <Title>Sign Up</Title>
            <h3 style={{ color: '#ccc', marginBottom: '20px' }}>Basic Information</h3>
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
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              required
            />
            <InputArea
              placeholder="Age"
              type="number"
              value={formData.age}
              onChange={(e) => updateFormData('age', e.target.value)}
              required
            />
            <InputArea
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
            />
            <InputArea
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              required
            />
            <Button type="button" onClick={() => handleNext(2)}>Next</Button>
          </form>
        )

      case 2:
        return (
          <form ref={formRef}>
            <Title>Sign Up</Title>
            <h3 style={{ color: '#ccc', marginBottom: '20px' }}>Account Details</h3>
            <InputArea
              placeholder="Username"
              value={formData.username}
              onChange={(e) => updateFormData('username', e.target.value)}
              required
            />
            <ButtonRow>
              <SmallButton type="button" onClick={() => setSignupStep(1)}>Back</SmallButton>
              <SmallButton type="button" onClick={() => handleNext(3)}>Next</SmallButton>
            </ButtonRow>
          </form>
        )

      case 3:
        return (
          <form ref={formRef}>
            <Title>Sign Up</Title>
            <h3 style={{ color: '#ccc', marginBottom: '20px' }}>Tell us about your preferences</h3>
            <InputArea
              placeholder="Favorite Foods (e.g., pizza, biryani, pho)"
              value={formData.likedFoods}
              onChange={(e) => updateFormData('likedFoods', e.target.value)}
              required
            />
            <InputArea
              placeholder="Important people in your life (e.g., Priya - Mother - Amma)"
              value={formData.likedPeople}
              onChange={(e) => updateFormData('likedPeople', e.target.value)}
              required
            />
            <InputArea
              placeholder="Favorite Activities (e.g., Baseball, Soccer, Reading)"
              value={formData.likedActivities}
              onChange={(e) => updateFormData('likedActivities', e.target.value)}
              required
            />
            <ButtonRow>
              <SmallButton type="button" onClick={() => setSignupStep(2)}>Back</SmallButton>
              <SmallButton type="button" onClick={() => handleNext(4)}>Next</SmallButton>
            </ButtonRow>
          </form>
        )

      case 4:
        return (
          <form ref={formRef}>
            <Title>Sign Up</Title>
            <h3 style={{ color: '#ccc', marginBottom: '20px' }}>What do you dislike?</h3>
            <InputArea
              placeholder="Foods you dislike (e.g., Broccoli, Bell peppers)"
              value={formData.dislikedFoods}
              onChange={(e) => updateFormData('dislikedFoods', e.target.value)}
              required
            />
            <InputArea
              placeholder="Activities you dislike (e.g., Homework, Basketball)"
              value={formData.dislikedActivities}
              onChange={(e) => updateFormData('dislikedActivities', e.target.value)}
              required
            />
            <ButtonRow>
              <SmallButton type="button" onClick={() => setSignupStep(3)}>Back</SmallButton>
              <SmallButton type="button" onClick={() => handleNext(5)}>Next</SmallButton>
            </ButtonRow>
          </form>
        )

      case 5:
        return (
          <div>
            <Title>Confirm Your Details</Title>
            <div style={{ color: '#ccc', textAlign: 'left', marginBottom: '20px' }}>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Age:</strong> {formData.age}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Username:</strong> {formData.username}</p>
              <p><strong>Favorite Foods:</strong> {formData.likedFoods}</p>
              <p><strong>Important People:</strong> {formData.likedPeople}</p>
              <p><strong>Favorite Activities:</strong> {formData.likedActivities}</p>
              <p><strong>Disliked Foods:</strong> {formData.dislikedFoods}</p>
              <p><strong>Disliked Activities:</strong> {formData.dislikedActivities}</p>
            </div>
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
            <ButtonRow>
              <SmallButton onClick={() => setSignupStep(4)}>Back</SmallButton>
              <SmallButton $green onClick={handleSignup}>Create Account</SmallButton>
            </ButtonRow>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{ background: '#1a1b21', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div></div>
        <Button onClick={() => router.push('/login')}>Login</Button>
      </div>
      <Container>
        {renderSignupForm()}
        <p style={{ color: '#ccc', textAlign: 'center', marginTop: '20px' }}>
          Already have an account?{' '}
          <span 
            style={{ color: '#2196f3', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => router.push('/login')}
          >
            Login
          </span>
        </p>
      </Container>
    </div>
  )
}
