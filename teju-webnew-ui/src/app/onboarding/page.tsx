"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const questions = [
  { key: "name", label: "What is your name?", type: "text" },
  { key: "age", label: "How old are you?", type: "number" },
  { key: "likes_food", label: "What foods do you like? (including ethnic food)", type: "text" },
  { key: "important_people", label: "Who are important people in your life?", type: "text" },
  { key: "activities", label: "What activities do you like to do?", type: "text" },
  { key: "classmates", label: "Who are your classmates?", type: "text" },
  { key: "family", label: "Who are your family members?", type: "text" },
  { key: "teachers", label: "Who are your teachers?", type: "text" },
  { key: "call_parents", label: "What do you call your parents?", type: "text" },
  { key: "siblings", label: "Do you have siblings? What are their names?", type: "text" },
  { key: "nicknames", label: "Do you have any nicknames?", type: "text" },
  { key: "frustrate", label: "What things frustrate you?", type: "text" },
  { key: "happy", label: "What things make you happy?", type: "text" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user came from successful payment
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      setPaymentSuccess(true);
      // Store payment success in localStorage
      localStorage.setItem('payment_success', 'true');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnswers({ ...answers, [questions[step].key]: e.target.value });
  };

  const handleNext = () => {
    setError("");
    if (!answers[questions[step].key] || answers[questions[step].key].toString().trim() === "") {
      setError("Please answer this question to continue.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Save user profile to localStorage
      localStorage.setItem("user_profile", JSON.stringify(answers));
      setSuccess("Profile saved! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/main");
      }, 1200);
    } catch {
      setError("Failed to save profile. Please try again.");
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
        {/* Payment Success Message */}
        {paymentSuccess && (
          <div style={{
            background: "rgba(34, 197, 94, 0.13)",
            border: "1.5px solid #22c55e",
            color: "#22c55e",
            padding: "12px 16px",
            borderRadius: 7,
            marginBottom: 12,
            fontSize: "1rem",
            textAlign: "center",
            width: "100%"
          }}>
            🎉 Payment successful! Welcome to Teju Web Premium!
          </div>
        )}

        <div style={{ width: "100%", minHeight: 120, transition: "all 0.4s cubic-bezier(.77,0,.18,1)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <label htmlFor={questions[step].key} style={{ color: "#fff", fontSize: "1.18rem", fontWeight: 600, textAlign: "center", width: '100%' }}>
            {questions[step].label}
          </label>
        </div>
        <div style={{ width: "100%", margin: "18px 0 0 0" }}>
          {questions[step].type === "text" ? (
            <textarea
              id={questions[step].key}
              value={answers[questions[step].key] || ""}
              onChange={handleChange}
              rows={2}
              style={{
                width: "100%",
                padding: "15px 16px",
                background: "#23242a",
                color: "#f5f6fa",
                border: "1.5px solid #292a33",
                borderRadius: 8,
                fontSize: "1.08rem",
                marginBottom: 8,
                transition: "border 0.2s, box-shadow 0.2s",
                resize: 'vertical',
              }}
              autoFocus
            />
          ) : (
            <input
              id={questions[step].key}
              type="number"
              value={answers[questions[step].key] || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "15px 16px",
                background: "#23242a",
                color: "#f5f6fa",
                border: "1.5px solid #292a33",
                borderRadius: 8,
                fontSize: "1.08rem",
                marginBottom: 8,
                transition: "border 0.2s, box-shadow 0.2s",
              }}
              autoFocus
            />
          )}
        </div>
        {error && <div style={{ background: "rgba(229, 57, 53, 0.13)", border: "1.5px solid #e53935", color: "#e53935", padding: "12px 16px", borderRadius: 7, marginBottom: 12, fontSize: "1rem", textAlign: "center" }}>{error}</div>}
        {success && <div style={{ background: "rgba(34, 197, 94, 0.13)", border: "1.5px solid #22c55e", color: "#22c55e", padding: "12px 16px", borderRadius: 7, marginBottom: 12, fontSize: "1rem", textAlign: "center" }}>{success}</div>}
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginTop: 18 }}>
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0 || loading}
            style={{
              background: step === 0 ? '#666' : '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '1.05rem',
              padding: '11px 18px',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              minWidth: 90,
              transition: 'background 0.2s',
            }}
          >
            Back
          </button>
          {step < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              style={{
                background: '#2196f3',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '1.05rem',
                padding: '11px 18px',
                cursor: loading ? 'not-allowed' : 'pointer',
                minWidth: 90,
                transition: 'background 0.2s',
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '1.05rem',
                padding: '11px 18px',
                cursor: loading ? 'not-allowed' : 'pointer',
                minWidth: 90,
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Saving...' : 'Finish'}
            </button>
          )}
        </div>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: 18, justifyContent: 'center', width: '100%' }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i === step ? '#2196f3' : '#444',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
} 