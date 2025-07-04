"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainInterface from "./components/MainInterface";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    
    if (user) {
      // Check if user has completed their profile
      const userProfile = localStorage.getItem('user_profile');
      if (userProfile) {
        // User is authenticated and has completed profile, redirect to main app
        router.push('/main');
      } else {
        // User is authenticated but hasn't completed profile, redirect to onboarding
        router.push('/onboarding');
      }
    } else {
      // User is not authenticated, redirect to auth page
      router.push('/auth');
    }
    
    setIsLoading(false);
  }, [router]);

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

  return null;
}
