"use client";
import React, { useState } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { TextAreaContainer, TextArea, SmallButton } from "../components/MainInterface.styles";

export default function Keyboard() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSpeakOption = (text: string) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (<>
            <SmallButton onClick={() => router.push('/')}>Back</SmallButton>
            <TextAreaContainer>
              <TextArea
                placeholder="Enter your message here..."
                value={text}
                onChange={e => setText(e.target.value)}>
              </TextArea>
              <SmallButton onClick={() => handleSpeakOption(text)}>Speak Aloud</SmallButton>
            </TextAreaContainer>
          </>);
} 