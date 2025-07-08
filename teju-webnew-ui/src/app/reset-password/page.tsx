"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaEye, FaEyeSlash} from 'react-icons/fa';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error.message);
      } else if (data.session && data.session.user) {
        const email = data.session.user.email;
        console.log('User email:', email);
        console.log("data: ", data)
        const payload = {
            email: email, 
            password: password
          };

        const response = await fetch('/api/auth/update-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const response_data = await response.json();
        // if (error) {
        //   setError(error.message || "Failed to reset password.");

        if (!response.ok) {
          console.log("HIHIIHIHIHIHIIHI");
          console.log("data.error: ", response_data.error);
          setError(response_data.error || "Failed to reset password.");
        } else {
          setSuccess("Password reset successful! Redirecting to sign in...");
          setTimeout(() => {
            router.push("/auth");
          }, 1800);
        }
      }
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: 410,
        width: "100%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 1.5px 0 rgba(255,255,255,0.04)",
        border: "1.5px solid #292a33",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ textAlign: "center", width: "100%" }}>
          <h1 style={{ 
            color: "#fff", 
            fontSize: "1.8rem", 
            fontWeight: 700, 
            marginBottom: 8,
            letterSpacing: "-0.5px"
          }}>
            Reset Password
          </h1>
          <p style={{ 
            color: "#ccc", 
            fontSize: "1.1rem", 
            marginBottom: 24,
            lineHeight: 1.5
          }}>
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "15px 16px",
                background: "#23242a",
                color: "#f5f6fa",
                border: "1.5px solid #292a33",
                borderRadius: 8,
                fontSize: "1.08rem",
                transition: "border 0.2s, box-shadow 0.2s",
              }}
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

          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "15px 16px",
                background: "#23242a",
                color: "#f5f6fa",
                border: "1.5px solid #292a33",
                borderRadius: 8,
                fontSize: "1.08rem",
                transition: "border 0.2s, box-shadow 0.2s",
              }}
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

          {error && (
            <div style={{ 
              background: "rgba(229, 57, 53, 0.13)", 
              border: "1.5px solid #e53935", 
              color: "#e53935", 
              padding: "12px 16px", 
              borderRadius: 7, 
              fontSize: "1rem", 
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ 
              background: "rgba(34, 197, 94, 0.13)", 
              border: "1.5px solid #22c55e", 
              color: "#22c55e", 
              padding: "12px 16px", 
              borderRadius: 7, 
              fontSize: "1rem", 
              textAlign: "center"
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
} 