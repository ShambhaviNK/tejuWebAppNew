"use client";
import React, { useState, useRef, useEffect} from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { Container, Title, Button, TextAreaContainer, TextAreaWithIcon, MicIcon, OptionsRow, OptionButton, ErrorMsg } from "./MainInterface.styles";

// Minimal type definitions for SpeechRecognition API if not present
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    SpeechRecognitionEvent: any;
  }
}

// Type declarations for SpeechRecognition API (for TypeScript compatibility)
// type SpeechRecognition = typeof window.SpeechRecognition;
type SpeechRecognitionEvent = typeof window.SpeechRecognitionEvent;

export default function MainInterface() {
  const [text, setText] = useState("");
  const recognitionRef = useRef<any>(null);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const accumulatedTranscriptRef = useRef("");
  const [clicked, setClicked] = useState(-1);
  useEffect(() => {
  console.log("Updated options:", options);
}, [options]);

  const handleRecognizeSpeech = () => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = (event: unknown) => {
        const speechEvent = event as SpeechRecognitionEvent;
        let fullTranscript = "";
        for (let i = 0; i < speechEvent.results.length; i++) {
          let transcript = speechEvent.results[i][0].transcript.trim();
          transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
          if (!/[.!?]$/.test(transcript)) {
            transcript += ".";
          }
          transcript = transcript.replace(/\s(and|but|so|or)\s/gi, ", $1 ");
          fullTranscript += (fullTranscript ? " " : "") + transcript;
        }
        setText(fullTranscript);
      };
      recognitionRef.current.onerror = (event: unknown) => {
        const errorEvent = event as { error: string };
        alert("Speech recognition error: " + errorEvent.error);
        setRecognizing(false);
      };
      recognitionRef.current.onend = () => {
        setRecognizing(false);
      };
    }
    if (!recognizing) {
      accumulatedTranscriptRef.current = "";
      recognitionRef.current.start();
      setRecognizing(true);
    } else {
      recognitionRef.current.stop();
      setRecognizing(false);
    }
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
          .map((o: string) => {
            const match = o.match(/^[A-D][).]\s*(.*)$/);
            return match ? match[1].trim() : null;
          })
          .filter((o: string | null) => o !== null);

        if (opts.length < 4) {
          opts = data.options.split(/\n|\r/).filter((o: string) => o.trim()).slice(0, 4);
        }
        if (opts.length === 4) {
          setOptions(opts);
        } else {
          setOptions([data.options, "", "", ""]);
        }
      } else {
        setError("No options returned from API.");
        setOptions(["", "", "", ""]);
      }
    } catch {
      alert("Audio recognition failed.");
      setError("Failed to generate options.");
      setOptions(["", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakText = () => {
    if (!text.trim()) {
      alert("Please enter text or recognize speech first.");
      return;
    }
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakOption = (option: string, btn_idx: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    setClicked(btn_idx);
    const utterance = new window.SpeechSynthesisUtterance(option);
    utterance.onend = () => {
      setClicked(-1);
    }
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Container>
      <Title>Model loaded successfully</Title>
      <TextAreaContainer>
        <TextAreaWithIcon
          placeholder="Type or speak your question here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <MicIcon $recognizing={recognizing} onClick={handleRecognizeSpeech}>
          {recognizing ? <FaStop /> : <FaMicrophone />}
        </MicIcon>
      </TextAreaContainer>
      <Button $green onClick={handleSpeakText}>Speak Text</Button>
      <Button onClick={handleGenerateOptions} disabled={loading || !text}>
        {loading ? "Generating..." : "Generate Options"}
      </Button>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <OptionsRow>
        <OptionButton $clicked = {clicked === 0} onClick={() => handleSpeakOption(options[0], 0)}>{options[0]}</OptionButton>
        <OptionButton $clicked = {clicked === 1} onClick={() => handleSpeakOption(options[1], 1)}>{options[1]}</OptionButton>
      </OptionsRow>
      <OptionsRow>
        <OptionButton $clicked = {clicked === 2} onClick={() => handleSpeakOption(options[2], 2)}>{options[2]}</OptionButton>
        <OptionButton $clicked = {clicked === 3} onClick={() => handleSpeakOption(options[3], 3)}>{options[3]}</OptionButton>
      </OptionsRow>
    </Container>
  );
} 