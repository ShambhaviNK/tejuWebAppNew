"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainInterface from "../components/MainInterface";
import { Analytics } from "@vercel/analytics/next"

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (!user) {
      // User is not authenticated, redirect to auth page
      router.push('/auth');
      return;
    }
    
    try {
      const parsed = JSON.parse(user);
      setUsername(parsed.name || null);
      
      // Check if user has completed their profile
      const userProfile = localStorage.getItem('user_profile');
      if (!userProfile) {
        // User hasn't completed onboarding, redirect to onboarding
        router.push('/onboarding');
        return;
      }
      
      // Check for trial demo
      const isTrial = localStorage.getItem('trial_demo') === 'true';
      const trialStart = localStorage.getItem('trial_start');
      if (isTrial && trialStart) {
        const now = Date.now();
        const trialStartTime = parseInt(trialStart, 10);
        const oneDay = 14 * 24 * 60 * 60 * 1000;
        if (now - trialStartTime > oneDay) {
          // Trial expired
          localStorage.removeItem('payment_success');
          localStorage.removeItem('trial_demo');
          localStorage.removeItem('trial_start');
          router.push('/payment?trial_expired=1');
          return;
        }
      }

      // User is authenticated and has completed profile
      setIsAuthenticated(true);
    } catch {
      setUsername(null);
    }
    
    setIsLoading(false);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('user_profile');
    router.push('/auth');
  };

  if (isLoading) {
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

  if (!isAuthenticated) {
    return null;
  }

  // Height of the top bar (should match in both style and marginTop)
  const TOP_BAR_HEIGHT = 64;

  return (
    <div>
      
      {/* Beautified glassy top bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: TOP_BAR_HEIGHT,
          background: 'rgba(30, 32, 40, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          boxSizing: 'border-box',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)',
          borderBottom: '1.5px solid rgba(255,255,255,0.07)',
          transition: 'height 0.2s',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fff',
            fontSize: '1.18rem',
            fontWeight: 600,
            letterSpacing: '-0.5px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '60vw',
            userSelect: 'none',
          }}
        >
          {username && <span style={{fontWeight: 700}}>Hi, {username}</span>}
        </div>
        <button
          onClick={handleSignOut}
          style={{
            background: 'linear-gradient(90deg, #e53935 60%, #ff6f61 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '11px 26px',
            cursor: 'pointer',
            fontSize: '1.05rem',
            fontWeight: 600,
            boxShadow: '0 2px 8px 0 rgba(229,57,53,0.10)',
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
            outline: 'none',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#b71c1c')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'linear-gradient(90deg, #e53935 60%, #ff6f61 100%)')}
        >
          Sign Out
        </button>
        <style>{`
          @media (max-width: 600px) {
            div[style*='position: fixed'] {
              height: 54px !important;
              padding: 0 8px !important;
            }
            div[style*='position: fixed'] > div {
              font-size: 1.01rem !important;
              max-width: 48vw !important;
            }
            div[style*='position: fixed'] > button {
              font-size: 0.97rem !important;
              padding: 8px 16px !important;
            }
          }
        `}</style>
      </div>
      {/* Add margin to main content so it doesn't go under the bar */}
      <div style={{ marginTop: TOP_BAR_HEIGHT + 16, transition: 'margin-top 0.2s' }}>
        <Analytics/>
        <MainInterface />
      </div>
    </div>
  );
} 