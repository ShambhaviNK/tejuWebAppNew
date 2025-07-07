"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message || "Failed to reset password.");
      } else {
        setSuccess("Password reset successful! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/auth");
        }, 1800);
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
              type="password"
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
          </div>

          <div style={{ position: "relative" }}>
            <input
              type="password"
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