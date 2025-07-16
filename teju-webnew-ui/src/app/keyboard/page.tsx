"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { TextArea } from "../components/MainInterface.styles";
import { FaArrowLeft, FaVolumeUp } from "react-icons/fa";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./page.css";


export default function KeyboardPage() {
  const [checked, setChecked] = useState(true);
  const [caps, setCaps] = useState(false);
  const [text, setText] = useState("");
  const keyboardRef = useRef<any>(null);
  const router = useRouter();

  const handleClick = () => {
    setChecked(!checked);
  }

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
    } else if (button === "{lock}") {
      setCaps(!caps);
    } 
    else if (!button.startsWith("{")) {
      setText((prev) => prev.slice(0, cursor_pos) + button + prev.slice(cursor_pos));
    }
  };

  return (
    <>
      <button onClick={() => router.push("/")}
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
        aria-label="Back"><FaArrowLeft></FaArrowLeft></button>
      <div style={{
        width: '100vw',
        height: '100vh',
        background: "#23242a",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1
      }}>
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', marginTop: 32, marginBottom: 32 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <TextArea
              placeholder="Enter your message here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                fontSize: 'clamp(22px, 4vw, 32px)',
                padding: '28px 70px 28px 28px',
                borderRadius: 20,
                border: "2px solid #2196f3",
                width: "100%",
                minHeight: 100,
                background: "#181920",
                color: "#fff",
                outline: "none",
                resize: "none",
                boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
                boxSizing: 'border-box',
                maxWidth: 900,
                fontFamily: 'inherit',
                transition: 'border 0.2s',
              }}
            />
            <button 
              onClick={() => handleSpeakOption(text)}
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#2196f3',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 28,
                boxShadow: '0 2px 8px rgba(33,150,243,0.13)',
                transition: 'background 0.2s',
                zIndex: 2
              }}
            >
              <FaVolumeUp />
            </button>
          </div>
        </div>
        <div className="keyboard-container" style={{ 
          width: '100%', 
          height: '80vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 0,
          padding: 0,
          margin: 0
        }}>
          <div style={{alignSelf: 'normal', paddingLeft: '10px'}}>
          <input onClick={handleClick} type="checkbox"/>
          <label> Toggle between QWERTY and ABCD keyboard layout</label>
          </div>
          <Keyboard
            keyboardRef={r => (keyboardRef.current = r)}
            theme={"hg-theme-default hg-layout-default myTheme"}
            onKeyPress={onKeyPress}
            physicalKeyboardHighlight={true}
            layoutName= {caps ? (checked ? "QWERTY" : "ABCD") : (checked ? "qwerty" : "abcd")}
            display= {{
            '{bksp}': 'BACKSPACE',
            '{enter}': 'ENTER',
            '{lock}': 'CAPS',
            '{space}': 'SPACE'}}
            layout={{
              qwerty: [
                "1 2 3 4 5 6 7 8 9 0",
                "q w e r t y u i o p {bksp}",
                "{lock} a s d f g h j k l ' {enter}",
                "z x c v b n m , . ?",
                "{space}"
              ],
              QWERTY: [
                "1 2 3 4 5 6 7 8 9 0",
                "Q W E R T Y U I O P {bksp}",
                "{lock} A S D F G H J K L ' {enter}",
                "Z X C V B N M , . ?",
                "{space}"
              ],
              abcd: [
                "1 2 3 4 5 6 7 8 9 0",
                "a b c d e f g h i {bksp}",
                "{lock} j k l m n o p q r s ' {enter}",
                "t u v w x y z , . ?",
                "{space}"
              ],
              ABCD: [
                "1 2 3 4 5 6 7 8 9 0",
                "A B C D E F G H I {bksp}",
                "{lock} J K L M N O P Q R S ' {enter}",
                "T U V W X Y Z , . ?",
                "{space}"
              ]
            }}
            style={{
              width: '100%',
              height: '100%',
              '--hg-button-size': 'clamp(70px, 18vw, 140px)',
              '--hg-button-gap': '0px',
              '--hg-button-margin': '0px',
              '--hg-button-padding': '0px',
              '--hg-button-border-radius': '24px',
              '--hg-button-bg': '#2196f3',
              '--hg-button-color': '#fff',
              '--hg-button-border': 'none',
              '--hg-button-box-shadow': '0 2px 8px rgba(33,150,243,0.13)',
              '--hg-button-font-weight': '700',
              '--hg-button-letter-spacing': '1px',
              '--hg-button-transition': 'background 0.15s, transform 0.08s, box-shadow 0.15s',
              '--hg-button-hover-bg': '#1976d2',
              '--hg-button-active-bg': '#1565c0',
              '--hg-button-active-transform': 'scale(0.96)',
              '--hg-button-active-filter': 'brightness(0.93)',
            }}
          />
        </div>
      </div>
    </>
  );
}
