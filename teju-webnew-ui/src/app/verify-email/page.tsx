"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../lib/supabase';

export default function VerifyEmailPage() {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserEmail(parsed.email || null);
    }
  }, []);

  // Poll for email confirmation every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email_confirmed_at) {
        router.push("/payment");
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [router]);

  const handleResendEmail = async () => {
    setResendLoading(true);
    setResendMsg("");
    if (!userEmail) return;
    // const { error } = await supabase.auth.resend({ type: "signup", email: userEmail });
    const { error } = await supabase.auth.resend(
      {type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/payment`
        }
      })
    if (error) {
      setResendMsg("Failed to resend confirmation email.");
    } else {
      setResendMsg("Confirmation email resent! Check your inbox.");
    }
    setResendLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#23242a',
      color: '#fff',
      fontSize: '1.2rem',
      textAlign: 'center',
      padding: 32
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>Please verify your email</h2>
      <p style={{ marginBottom: 24 }}>
        Check your inbox and click the confirmation link to continue.<br />
        Didn&apos;t get the email?&nbsp;
        <button onClick={handleResendEmail} disabled={resendLoading} style={{ color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '1.1rem' }}>
          {resendLoading ? 'Resending...' : 'Resend Email'}
        </button>
      </p>
      {resendMsg && <div style={{ color: '#22c55e', marginBottom: 12 }}>{resendMsg}</div>}
    </div>
  );
} 