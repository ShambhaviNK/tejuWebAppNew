"use client";
import React, { useState } from "react";
import { FaArrowLeft, FaVolumeUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { TextAreaContainer, TextArea } from "../components/MainInterface.styles";

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
  ["SPACE", "BACK"]
];

export default function Keyboard() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSpeakOption = (text: string) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyClick = (key: string) => {
    if (key === "SPACE") setText(t => t + " ");
    else if (key === "BACK") setText(t => t.slice(0, -1));
    else setText(t => t + key);
  };

  return (
    <div style={{
      height: "100vh",
      width: '100vw',
      background: "linear-gradient(135deg, #23242a 0%, #181920 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: 'border-box',
      padding: 0,
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      <button
        onClick={() => router.push('/')}
        style={{
          position: "fixed",
          top: 18,
          left: 18,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#2196f3",
          color: "#fff",
          border: "2px solid #fff2",
          boxShadow: "0 2px 12px rgba(33,150,243,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          cursor: "pointer",
          transition: "background 0.2s, border 0.2s",
          zIndex: 10,
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#1976d2')}
        onMouseOut={e => (e.currentTarget.style.background = '#2196f3')}
        aria-label="Back"
      >
        <FaArrowLeft />
      </button>
      <div style={{
        background: "#23242a",
        borderRadius: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        width: '98vw',
        maxWidth: 480,
        margin: '0 auto',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'flex-end',
        padding: '24px 12px 18px 12px',
        boxSizing: 'border-box',
        minHeight: '60vh',
      }}>
        <h2 style={{ color: "#fff", margin: '0 0 16px 0', fontWeight: 700, fontSize: 'clamp(20px, 5vw, 30px)', letterSpacing: 1, textAlign: 'center' }}>Type your message</h2>
        <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
          <textarea
            placeholder="Enter your message here..."
            value={text}
            onChange={e => setText(e.target.value)}
            style={{
              fontSize: 'clamp(16px, 4vw, 22px)',
              padding: '16px 60px 16px 16px',
              borderRadius: 14,
              border: "2px solid #2196f3",
              width: "100%",
              minHeight: 48,
              marginBottom: 16,
              background: "#181920",
              color: "#fff",
              outline: "none",
              resize: "none",
              boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
              boxSizing: 'border-box',
              maxWidth: 440,
              fontFamily: 'inherit',
              transition: 'border 0.2s',
            }}
            onFocus={e => e.currentTarget.style.border = '2.5px solid #21cbf3'}
            onBlur={e => e.currentTarget.style.border = '2px solid #2196f3'}
          />
          <button
            onClick={() => handleSpeakOption(text)}
            style={{
              position: 'absolute',
              right: 12,
              top: '42%',
              transform: 'translateY(-50%)',
              background: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 22,
              boxShadow: '0 2px 8px rgba(33,150,243,0.13)',
              transition: 'background 0.2s',
              zIndex: 2
            }}
            aria-label="Speak Aloud"
          >
            <FaVolumeUp />
          </button>
        </div>
        <div style={{ width: '100%', height: 1, background: '#21cbf355', margin: '0 0 18px 0', borderRadius: 2 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: '2vw',
            alignItems: "center",
            width: "100%",
            maxWidth: 440,
            margin: "0 auto",
            marginTop: 'auto',
            paddingBottom: '2vw',
            justifyContent: 'flex-end',
            boxSizing: 'border-box',
          }}
        >
          {KEYS.map((row, i) => (
            <div key={i} style={{ display: "flex", flexDirection: 'row', flexWrap: 'nowrap', justifyContent: "center", width: '100%' }}>
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  style={{
                    fontSize: 'clamp(16px, 4vw, 22px)',
                    width: key === "SPACE" ? 'clamp(80px, 30vw, 200px)' : 'clamp(36px, 8vw, 48px)',
                    minWidth: key === "SPACE" ? 80 : 36,
                    maxWidth: key === "SPACE" ? 200 : 48,
                    padding: key === "SPACE" ? "2vw 0" : "2vw 0",
                    borderRadius: 14,
                    border: "none",
                    background: key === "BACK" ? "#e53935" : "#2196f3",
                    color: "#fff",
                    margin: 3,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(33,150,243,0.13)",
                    fontWeight: 700,
                    letterSpacing: 1,
                    transition: 'background 0.15s, transform 0.08s, box-shadow 0.15s',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                  onMouseDown={e => {
                    e.currentTarget.style.transform = 'scale(0.96)';
                    e.currentTarget.style.filter = 'brightness(0.93)';
                  }}
                  onMouseUp={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                >
                  {key === "SPACE" ? "␣" : key === "BACK" ? <span style={{fontSize: 'clamp(15px, 4vw, 22px)'}}>⌫</span> : key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 