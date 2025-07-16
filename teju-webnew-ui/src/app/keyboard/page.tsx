"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextAreaContainer, TextArea, SmallButton } from "../components/MainInterface.styles";
import { FaArrowLeft, FaVolumeUp } from "react-icons/fa";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { ImFontSize } from "react-icons/im";
import "./page.css";


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
      <SmallButton onClick={() => router.push("/")}
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
        aria-label="Back"><FaArrowLeft></FaArrowLeft></SmallButton>
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
        minHeight: '20vh',
        maxHeight: '1000vh'
      }}>
        {/* <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}></div> */}
      {/* <TextAreaContainer style={{ position: 'relative' }}> */}
                 <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
           <TextArea
             placeholder="Enter your message here..."
             value={text}
             onChange={(e) => setText(e.target.value)}
             style={{
               fontSize: 'clamp(16px, 4vw, 22px)',
               padding: '16px 60px 16px 16px',
               borderRadius: 14,
               border: "2px solid #2196f3",
               width: "100%",
               minHeight: 48,
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
           />
           <button 
             onClick={() => handleSpeakOption(text)}
             style={{
               position: 'absolute',
               right: 12,
               top: '50%',
               transform: 'translateY(-50%)',
               background: '#2196f3',
               color: '#fff',
               border: 'none',
               borderRadius: '50%',
               width: 36,
               height: 36,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               cursor: 'pointer',
               fontSize: 18,
               boxShadow: '0 2px 8px rgba(33,150,243,0.13)',
               transition: 'background 0.2s',
               zIndex: 2
             }}
           >
             <FaVolumeUp />
           </button>
         </div>
      {/* </TextAreaContainer> */}
      <Keyboard
        keyboardRef={r => (keyboardRef.current = r)}
        theme={"hg-theme-default hg-layout-default myTheme"}
        onKeyPress={onKeyPress}
        physicalKeyboardHighlight={true}
        layoutName="default"
        // physicalKeyboardHighlightPress={true}
        layout={{
          default: [
            "q w e r t y u i o p {bksp}",
            "a s d f g h j k l {enter}",
            "z x c v b n m",
            "{space}"
          ]
        }}
        // buttonTheme={[
        //   {
        //     class: "hg-black-text",
        //     buttons: ""
        //   }
        // ]}
      />
      </div>
    </>
  );
}
