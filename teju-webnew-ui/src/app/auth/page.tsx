"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContainer, AuthForm, AuthToggle, AuthTitle, Input, Button, ErrorMessage, SuccessMessage, Divider } from './auth.styles';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { MainHeading, SubHeading } from '../components/MainInterface.styles';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (isSignUp) {
      if (!formData.name) {
        setError('Please fill in all required fields');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
      const payload = isSignUp ? formData : {
        email: formData.email,
        password: formData.password
      };

      //this adds your info to the db 
      await supabase.auth.signUp(formData);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(isSignUp ? 'Account created successfully! Please check your email to confirm your account.' : 'Signed in successfully! Redirecting...');
        
        // Store user data in localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        setTimeout(async () => {
          if (isSignUp) {
            router.push('/verify-email');
          } else {
            // For sign in, check if confirmed
            const { data: authData } = await supabase.auth.getUser();
            if (authData?.user && !authData.user.email_confirmed_at) {
              router.push('/verify-email');
            } else {
              router.push('/payment');
            }
          }
        }, 1500);
      } else {
        setError(data.error || 'An error occurred. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : undefined,
        },
      });
      if (error) {
        setError('Google sign-in failed. Please try again.');
      }
      // Supabase will redirect, so no need to handle success here
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotMsg('');
    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
      });
      if (error) {
        setForgotMsg('Failed to send reset email. Please check the email and try again.');
      } else {
        setForgotMsg('Password reset email sent! Check your inbox.');
      }
    } catch {
      setForgotMsg('Failed to send reset email. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <AuthContainer style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0', background: 'none' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, marginTop: 32 }}>
        <MainHeading style={{ marginBottom: 8, fontSize: '2.5rem' }}>Teju Talks</MainHeading>
        <SubHeading style={{ marginBottom: 0, fontSize: '1.15rem', maxWidth: 400 }}>AI-Powered Communication Assistant</SubHeading>
      </div>
      <AuthForm onSubmit={handleSubmit}>
        <AuthTitle>{isSignUp ? 'Create Account' : 'Sign In'}</AuthTitle>
        
        {/* Email field */}
        <div style={{ position: 'relative' }}>
          <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            style={{ paddingLeft: '40px' }}
            required
          />
        </div>

        {/* Full Name field (only for sign up) */}
        {isSignUp && (
          <div style={{ position: 'relative' }}>
            <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
        )}

        {/* Password field */}
        <div style={{ position: 'relative' }}>
          <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ paddingLeft: '40px', paddingRight: '40px' }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer'
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Forgot password link and form below password field */}
        {!isSignUp && !showForgot && (
          <div style={{ textAlign: 'right', width: '100%', marginBottom: 8 }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#2196f3', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.98rem', padding: 0 }}
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>
          </div>
        )}
        {!isSignUp && showForgot && (
          <div style={{ width: '100%', marginBottom: 8 }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '13px 14px',
                borderRadius: 8,
                border: '1.5px solid #2196f3',
                fontSize: '1.05rem',
                marginBottom: 8,
                background: '#23242a',
                color: '#f5f6fa',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                style={{
                  background: '#2196f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  padding: '11px 18px',
                  cursor: forgotLoading ? 'not-allowed' : 'pointer',
                  flex: 1,
                }}
              >
                {forgotLoading ? 'Sending...' : 'Send reset email'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setForgotMsg(''); setForgotEmail(''); }}
                style={{
                  background: '#e53935',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  padding: '11px 18px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
            {forgotMsg && <div style={{ color: forgotMsg.includes('sent') ? '#22c55e' : '#e53935', marginTop: 8, fontSize: '0.98rem', textAlign: 'center' }}>{forgotMsg}</div>}
          </div>
        )}

        {isSignUp && (
          <>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer'
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {/* Sign in/up button */}
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>

        {/* Divider with 'or' above Google sign-in */}
        {!isSignUp && <Divider>or</Divider>}

        {/* Google Sign-In Button (only for sign in, not sign up) - at bottom */}
        {!isSignUp && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: '#fff',
              color: '#222',
              border: '1.5px solid #e0e0e0',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1.08rem',
              padding: '13px 0',
              marginBottom: '0',
              marginTop: '0',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px 0 rgba(60,60,60,0.04)',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            <FaGoogle style={{ fontSize: '1.2em', marginRight: 2 }} />
            Sign in with Google
          </button>
        )}

        {/* Auth toggle at the very bottom */}
        <AuthToggle onClick={toggleAuthMode}>
          {isSignUp 
            ? 'Already have an account? Sign In' 
            : "Don't have an account? Sign Up"
          }
        </AuthToggle>
      </AuthForm>
    </AuthContainer>
  );
} 