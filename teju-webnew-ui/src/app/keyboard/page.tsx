"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { TextAreaContainer, TextArea, SmallButton } from "../components/MainInterface.styles";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function KeyboardPage() {
  const [text, setText] = useState("");
  const keyboardRef = useRef<any>(null);
  const router = useRouter();

  const handleSpeakOption = (text: string) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // const onChange = (input: string) => {
  //   setText((prev) => prev + input);
  // };
  // let keyboard = new Keyboard({keyboardRef: keyboardRef.current});
  // useEffect(() => {keyboard.getCaretPosition();})

  const onKeyPress = (button: string) => {
    let cursor_pos = keyboardRef.current.getCaretPosition();
    if(keyboardRef.current.getCaretPosition() === null) {
      cursor_pos = text.length;
    }
    // const cursor_pos = keyboardRef.current.getCaretPosition();
    console.log("Button pressed:", button);
    console.log("cursor_pos: ", cursor_pos);

    if (button === "{bksp}") {
      setText((prev) => prev.substring(0, cursor_pos-1) + prev.substring(cursor_pos, prev.length));
    } else if (button === "{space}") {
      setText((prev) => prev.slice(0, cursor_pos) + " " + prev.slice(cursor_pos));
    } else if (button === "{enter}") {
      handleSpeakOption(text);
    } else if (!button.startsWith("{")) {
      setText((prev) => prev.slice(0, cursor_pos) + button + prev.slice(cursor_pos));
    }
  };

  return (
    <>
      <SmallButton onClick={() => router.push("/")}>Back</SmallButton>
      <TextAreaContainer>
        <TextArea
          placeholder="Enter your message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <SmallButton onClick={() => handleSpeakOption(text)}>Speak Aloud</SmallButton>
      </TextAreaContainer>

      <Keyboard
        keyboardRef={r => (keyboardRef.current = r)}
        // onChange={onChange}
        useMouseEvents={false}
        // updateCaretOnSelectionChange={false}
        onKeyPress={onKeyPress}
        // physicalKeyboardHighlightPress={true}
        layout={{
          default: [
            "q w e r t y u i o p {bksp}",
            "a s d f g h j k l {enter}",
            "z x c v b n m",
            "{space}"
          ]
        }}
      />
    </>
  );
}
