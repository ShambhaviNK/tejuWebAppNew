"use client";
import React, { useState, useRef } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { Container, Title, Button, TextArea, OptionsRow, OptionButton, ErrorMsg } from "./MainInterface.styles";

export default function MainInterface() {
  const [text, setText] = useState("");
  const recognitionRef = useRef<any>(null);
  const [options, setOptions] = useState(["Option A", "Option B", "Option C", "Option D"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const accumulatedTranscriptRef = useRef("");

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
      recognitionRef.current.onresult = (event: any) => {
        let fullTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          let transcript = event.results[i][0].transcript.trim();
          transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
          if (!/[.!?]$/.test(transcript)) {
            transcript += ".";
          }
          transcript = transcript.replace(/\s(and|but|so|or)\s/gi, ", $1 ");
          fullTranscript += (fullTranscript ? " " : "") + transcript;
        }
        setText(fullTranscript);
      };
      recognitionRef.current.onerror = (event: any) => {
        alert("Speech recognition error: " + event.error);
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
          .map((o: string) => o.trim())
          .filter((o: string) => o && /[A-D][).]/.test(o));
        if (opts.length < 4) {
          // fallback: try splitting by numbers or just lines
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
    } catch (err: any) {
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
      <Button onClick={handleRecognizeSpeech} $green={recognizing && !recognizing} $red={recognizing}>
        {recognizing ? <FaStop style={{ marginRight: 8 }} /> : <FaMicrophone style={{ marginRight: 8 }} />}
        {recognizing ? "Stop Recognizing" : "Recognize Speech"}
      </Button>
      <TextArea
        placeholder="Type or speak your question here..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <Button $green onClick={handleSpeakText}>Speak Text</Button>
      <Button onClick={handleGenerateOptions} disabled={loading || !text}>
        {loading ? "Generating..." : "Generate Options"}
      </Button>
      {error && <ErrorMsg>{error}</ErrorMsg>}
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