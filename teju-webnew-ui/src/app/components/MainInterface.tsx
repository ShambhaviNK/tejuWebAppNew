"use client";
import React, { useState, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: #23242a;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.4);
  margin: 40px auto;
  padding: 32px 24px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h2`
  color: #fff;
  margin-bottom: 24px;
  font-weight: 400;
`;
const Button = styled.button<{ $green?: boolean }>`
  background: ${({ $green }) => ($green ? "#22c55e" : "#2196f3")};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  margin: 12px 0;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
  &:hover {
    background: ${({ $green }) => ($green ? "#16a34a" : "#1976d2")};
  }
`;
const TextArea = styled.textarea`
  background: #23242a;
  color: #ccc;
  border: 2px solid #333;
  border-radius: 8px;
  width: 100%;
  min-height: 60px;
  margin: 12px 0;
  padding: 12px;
  font-size: 1rem;
  resize: none;
`;
const OptionsRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  margin: 8px 0;
`;
const OptionButton = styled(Button)`
  width: 100%;
  margin: 0;
  font-size: 1.1rem;
`;

export default function MainInterface() {
  const [text, setText] = useState("");
  const recognitionRef = useRef<any>(null);
  const [options, setOptions] = useState(["Option A", "Option B", "Option C", "Option D"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecognizeSpeech = () => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
      };
      recognitionRef.current.onerror = (event: any) => {
        alert("Speech recognition error: " + event.error);
      };
    }
    recognitionRef.current.start();
  };

  const handleGenerateOptions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setOptions(["", "", "", ""]);
        return;
      }
      if (data.options) {
        // Try to split the response into four options
        let opts = data.options
          .split(/\n|\r/)
          .map((o: string) => o.trim())
          .filter((o: string) => o && /[A-D][).]/.test(o));
        if (opts.length < 4) {
          // fallback: try splitting by numbers or just lines
          opts = data.options.split(/\n|\r/).filter((o: string) => o.trim()).slice(0, 4);
        }
        if (opts.length === 4) {
          setOptions(opts);
        } else {
          // Show the raw response in the first option, others blank
          setOptions([data.options, "", "", ""]);
        }
      } else {
        setError("No options returned from API.");
        setOptions(["", "", "", ""]);
      }
    } catch (err: any) {
      setError("Failed to generate options.");
      setOptions(["", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakText = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakOptions = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    // Speak each option with a pause between
    let idx = 0;
    const speakNext = () => {
      if (idx >= options.length) return;
      const utterance = new window.SpeechSynthesisUtterance(options[idx]);
      utterance.onend = () => {
        idx++;
        setTimeout(speakNext, 400); // 400ms pause between options
      };
      window.speechSynthesis.speak(utterance);
    };
    speakNext();
  };

  const handleSpeakOption = (option: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(option);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Container>
      <Title>Model loaded successfully</Title>
      <Button onClick={handleRecognizeSpeech}>Recognize Speech</Button>
      <TextArea
        placeholder="Type or speak your question here..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <Button $green onClick={handleSpeakText} disabled={!text}>Speak Text</Button>
      <Button onClick={handleGenerateOptions} disabled={loading || !text}>
        {loading ? "Generating..." : "Generate Options"}
      </Button>
      {error && <div style={{ color: 'red', margin: '8px 0' }}>{error}</div>}
      <Button onClick={handleSpeakOptions} disabled={options.some(o => !o)}>Speak 4 Options</Button>
      <OptionsRow>
        <OptionButton onClick={() => handleSpeakOption(options[0])}>{options[0]}</OptionButton>
        <OptionButton onClick={() => handleSpeakOption(options[1])}>{options[1]}</OptionButton>
      </OptionsRow>
      <OptionsRow>
        <OptionButton onClick={() => handleSpeakOption(options[2])}>{options[2]}</OptionButton>
        <OptionButton onClick={() => handleSpeakOption(options[3])}>{options[3]}</OptionButton>
      </OptionsRow>
    </Container>
  );
} 