"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextArea } from "../components/MainInterface.styles";
import { FaArrowLeft, FaVolumeUp } from "react-icons/fa";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./page.css";

// Common words for prediction
const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "are", "was", "were", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "can", "must",
  "here", "there", "where", "when", "why", "how", "what", "which", "who", "whom", "whose",
  "yes", "no", "not", "never", "always", "sometimes", "often", "usually", "rarely",
  "very", "really", "quite", "rather", "too", "so", "much", "many", "few", "little",
  "big", "small", "large", "tiny", "huge", "enormous", "great", "good", "bad", "nice", "beautiful", "ugly",
  "happy", "sad", "angry", "excited", "tired", "hungry", "thirsty", "hot", "cold", "warm", "cool",
  "today", "tomorrow", "yesterday", "morning", "afternoon", "evening", "night", "week", "month", "year",
  "please", "thank", "sorry", "excuse", "pardon", "hello", "goodbye", "welcome", "congratulations"
];

// Dictionary API endpoint
const DICTIONARY_API = "https://api.datamuse.com/words";


export default function KeyboardPage() {
  const [checked, setChecked] = useState(true);
  const [caps, setCaps] = useState(false);
  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dictionaryCache, setDictionaryCache] = useState<{[key: string]: string[]}>({});
  const keyboardRef = useRef<any>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Focus text area when component mounts
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  const handleClick = () => {
    setChecked(!checked);
  }

  const handleSpeakOption = (text: string) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Fetch words from dictionary API
  const fetchDictionaryWords = async (prefix: string): Promise<string[]> => {
    if (prefix.length < 2) return [];
    
    // Check cache first
    if (dictionaryCache[prefix]) {
      return dictionaryCache[prefix];
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`${DICTIONARY_API}?sp=${prefix}*&max=20`);
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const words = data.map((item: any) => item.word).filter((word: string) => 
          word.toLowerCase().startsWith(prefix.toLowerCase()) && word.length > prefix.length
        );
        
        // Cache the results
        setDictionaryCache(prev => ({ ...prev, [prefix]: words }));
        return words;
      }
      
      return [];
    } catch (error) {
      console.log("Dictionary API error, using fallback:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced word prediction function with dictionary
  const getWordPredictions = async (currentText: string) => {
    const words = currentText.split(' ');
    const currentWord = words[words.length - 1] || '';
    
    // If current word is empty or just a space, suggest next words
    if (currentWord === '' || currentWord === ' ') {
      await getNextWordPredictions(words.slice(0, -1).join(' '));
      return;
    }
    
    if (currentWord.length < 2) {
      setPredictions([]);
      return;
    }

    // Get common word predictions
    const commonSuggestions = commonWords
      .filter(word => word.toLowerCase().startsWith(currentWord.toLowerCase()))
      .slice(0, 3);

    // Get dictionary-based predictions
    const dictionaryPredictions = await fetchDictionaryWords(currentWord);
    
    // Combine and deduplicate predictions
    const allSuggestions = [...commonSuggestions, ...dictionaryPredictions]
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .slice(0, 5);

    setPredictions(allSuggestions);
  };

  // Predict next word based on context
  const getNextWordPredictions = async (previousText: string) => {
    const words = previousText.split(' ').filter(word => word.length > 0);
    const lastWord = words[words.length - 1] || '';
    
    // Context-based word suggestions
    const contextWords = {
      question: ["what", "when", "where", "why", "how", "which", "who", "is", "are", "can", "will", "would", "could"],
      greeting: ["hello", "hi", "good", "morning", "afternoon", "evening", "how", "are", "you", "nice", "meet"],
      weather: ["sunny", "rainy", "cloudy", "hot", "cold", "warm", "cool", "temperature", "weather", "today"],
      food: ["hungry", "eat", "food", "meal", "breakfast", "lunch", "dinner", "snack", "delicious", "tasty"],
      time: ["today", "tomorrow", "yesterday", "morning", "afternoon", "evening", "night", "time", "hour", "minute"]
    };

    // Detect context from previous words
    let contextType = "";
    const previousWords = words.join(' ').toLowerCase();
    
    if (previousWords.includes('?')) contextType = "question";
    else if (previousWords.includes('hello') || previousWords.includes('hi')) contextType = "greeting";
    else if (previousWords.includes('weather') || previousWords.includes('sunny') || previousWords.includes('rainy')) contextType = "weather";
    else if (previousWords.includes('hungry') || previousWords.includes('eat') || previousWords.includes('food')) contextType = "food";
    else if (previousWords.includes('time') || previousWords.includes('today') || previousWords.includes('tomorrow')) contextType = "time";

    // Get context-appropriate words
    let suggestions: string[] = [];
    if (contextType && contextWords[contextType as keyof typeof contextWords]) {
      suggestions = contextWords[contextType as keyof typeof contextWords].slice(0, 3);
    }

    // Add common words that frequently follow other words
    const commonNextWords = [
      "the", "a", "an", "is", "are", "was", "were", "will", "would", "could", "should",
      "in", "on", "at", "to", "for", "of", "with", "by", "from", "about", "like",
      "very", "really", "quite", "rather", "too", "so", "much", "many", "few", "little",
      "good", "bad", "big", "small", "new", "old", "high", "low", "long", "short",
      "today", "tomorrow", "yesterday", "now", "then", "soon", "later", "early", "late"
    ];

    // Filter common words based on last word context
    const filteredCommonWords = commonNextWords.filter(word => {
      // Add logic to suggest appropriate words based on last word
      if (lastWord.toLowerCase() === 'the') return ['best', 'most', 'only', 'same', 'other', 'new', 'good', 'big', 'small', 'first', 'last'].includes(word);
      if (lastWord.toLowerCase() === 'is') return ['good', 'bad', 'great', 'nice', 'beautiful', 'wonderful', 'amazing', 'perfect'].includes(word);
      if (lastWord.toLowerCase() === 'i') return ['am', 'will', 'would', 'could', 'should', 'think', 'know', 'want', 'like', 'love'].includes(word);
      if (lastWord.toLowerCase() === 'you') return ['are', 'will', 'would', 'could', 'should', 'think', 'know', 'want', 'like'].includes(word);
      return true;
    });

    suggestions = [...suggestions, ...filteredCommonWords.slice(0, 3)];

    // Get dictionary-based next word predictions
    const dictionaryPredictions = await fetchDictionaryWords(lastWord);
    
    // Combine all suggestions
    const allSuggestions = [...suggestions, ...dictionaryPredictions]
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .slice(0, 5);

    setPredictions(allSuggestions);
  };

  const handlePredictionClick = (prediction: string) => {
    const words = text.split(' ');
    words[words.length - 1] = prediction;
    const newText = words.join(' ') + ' ';
    setText(newText);
    setPredictions([]);
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
    console.log("Button pressed:", button);
    console.log("cursor_pos: ", cursor_pos);

    let newText = text;
    if (button === "{bksp}") {
      newText = text.substring(0, cursor_pos-1) + text.substring(cursor_pos, text.length);
    } else if (button === "{space}") {
      newText = text.slice(0, cursor_pos) + " " + text.slice(cursor_pos);
    } else if (button === "{enter}") {
      handleSpeakOption(text);
      return;
    } else if (button === "{lock}") {
      setCaps(!caps);
      return;
    } else if (!button.startsWith("{")) {
      newText = text.slice(0, cursor_pos) + button + text.slice(cursor_pos);
    }

    setText(newText);
    getWordPredictions(newText);
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
              ref={textAreaRef}
              placeholder="Enter your message here..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                getWordPredictions(e.target.value);
              }}
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

        {/* Word Prediction Bar */}
        {(predictions.length > 0 || isLoading) && (
          <div style={{
            width: '100%',
            maxWidth: 900,
            margin: '0 auto 30px auto',
            padding: '16px',
            background: 'rgba(33, 150, 243, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(33, 150, 243, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              fontSize: '12px',
              color: '#2196f3',
              fontWeight: '600'
            }}>
              <span>{isLoading ? '⏳' : '💡'}</span>
              <span>
                {isLoading ? 'Searching dictionary...' : 'Word Suggestions'}
              </span>
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {isLoading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#2196f3',
                  fontSize: '14px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #2196f3',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Finding words...</span>
                </div>
              ) : (
                predictions.map((prediction, index) => {
                  // Determine if this is a common word or dictionary word
                  const isCommonWord = commonWords.includes(prediction.toLowerCase());
                  
                  const buttonStyle = {
                    background: isCommonWord ? 'rgba(33, 150, 243, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                    color: isCommonWord ? '#2196f3' : '#4caf50',
                    border: isCommonWord ? '1px solid rgba(33, 150, 243, 0.3)' : '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: '500',
                    boxShadow: 'none',
                    position: 'relative' as const
                  };

                  return (
                    <button
                      key={index}
                      onClick={() => handlePredictionClick(prediction)}
                      style={buttonStyle}
                      onMouseOver={e => {
                        e.currentTarget.style.background = isCommonWord ? '#1976d2' : '#388e3c';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.border = 'none';
                      }}
                      onMouseOut={e => {
                        if (!isCommonWord) {
                          e.currentTarget.style.background = 'rgba(76, 175, 80, 0.1)';
                          e.currentTarget.style.color = '#4caf50';
                          e.currentTarget.style.border = '1px solid rgba(76, 175, 80, 0.3)';
                        } else {
                          e.currentTarget.style.background = 'rgba(33, 150, 243, 0.1)';
                          e.currentTarget.style.color = '#2196f3';
                          e.currentTarget.style.border = '1px solid rgba(33, 150, 243, 0.3)';
                        }
                      }}
                      title={isCommonWord ? 'Common word' : 'Dictionary word'}
                    >
                      {prediction}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        <div className="keyboard-container" style={{paddingBottom: '25px', 
          width: '100%', 
          height: '80vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 0,
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
