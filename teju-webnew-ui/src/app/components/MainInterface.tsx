"use client";
import React, { useState, useRef, useEffect} from "react";
import { FaMicrophone, FaStop, FaVolumeUp, FaTimes } from "react-icons/fa";
import { Container, SmallButton, ButtonRow, OptionsContainer, ContextTextArea, ContextTextAreaContainer, ContextMicIcon, ContextClearButton, TextAreaContainer, TextAreaWithIcon, MicIcon, SpeakerIcon, OptionsRow, OptionButton, ErrorMsg, MainHeading, SubHeading } from "./MainInterface.styles";

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
  const [context, setContext] = useState("");
  const recognitionRef = useRef<any>(null);
  const contextRecognitionRef = useRef<any>(null);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const [contextRecognizing, setContextRecognizing] = useState(false);
  const [clicked, setClicked] = useState(-1);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    console.log("Updated options:", options);
  }, [options]);

  // Load user profile data on component mount
  useEffect(() => {
    try {
      const profileData = localStorage.getItem('user_profile');
      if (profileData) {
        const parsed = JSON.parse(profileData);
        setUserProfile(parsed);
        console.log('User profile loaded:', parsed);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, []);

  // Enhanced punctuation processing function
  const improvePunctuation = (text: string): string => {
    let processed = text.trim();
    
    // Capitalize first letter
    processed = processed.charAt(0).toUpperCase() + processed.slice(1);
    
    // Remove filler words and sounds
    processed = processed
      .replace(/\b(um|uh|er|ah|hmm)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Add question marks for question words
    const questionWords = /\b(what|when|where|who|why|how|which|whose|whom|is|are|was|were|do|does|did|can|could|will|would|should|may|might)\b/i;
    if (questionWords.test(processed) && !/[?]$/.test(processed)) {
      processed = processed.replace(/[.!]$/, '') + '?';
    }
    
    // Add exclamation marks for emphasis words
    const emphasisWords = /\b(wow|amazing|incredible|fantastic|terrible|awful|great|excellent|perfect|horrible|wonderful|awesome)\b/i;
    if (emphasisWords.test(processed) && !/[!]$/.test(processed)) {
      processed = processed.replace(/[.?]$/, '') + '!';
    }
    
    // Improve conjunction punctuation
    processed = processed.replace(/\s(and|but|so|or|however|therefore|meanwhile|furthermore|moreover|nevertheless|consequently|accordingly|thus|hence|as\s+a\s+result)\s/gi, ', $1 ');
    
    // Ensure proper sentence ending
    if (!/[.!?]$/.test(processed)) {
      processed = processed + '.';
    }
    
    return processed;
  };

  const handleRecognizeSpeech = () => {
    if(recognizing && text.trim()) {
      recognitionRef.current.stop();
      setRecognizing(false);
      handleCheckCacheAndGenerateOptions(false);
    }
    else {
      if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        
        // Enhanced configuration for better recognition
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true; // Enable interim results for better UX
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.maxAlternatives = 3; // Get multiple alternatives
        recognitionRef.current.serviceURI = "";
        
        // Enhanced result processing
        recognitionRef.current.onresult = (event: unknown) => {
          const speechEvent = event as SpeechRecognitionEvent;
          let fullTranscript = "";
          let interimTranscript = "";
          
          for (let i = 0; i < speechEvent.results.length; i++) {
            const result = speechEvent.results[i];
            const transcript = result[0].transcript.trim();
            const confidence = result[0].confidence;
            
            // Only use results with good confidence
            if (confidence > 0.7) {
              if (result.isFinal) {
                let processedTranscript = transcript;
                
                // Enhanced text processing
                processedTranscript = improvePunctuation(transcript);
                
                fullTranscript += (fullTranscript ? " " : "") + processedTranscript;
              } else {
                interimTranscript += transcript;
              }
            }
          }
          
          // Update text with both final and interim results
          const displayText = fullTranscript + (interimTranscript ? ` ${interimTranscript}` : '');
          setText(displayText);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setRecognizing(false);
          if (event.error === 'no-speech') {
            alert('No speech detected. Please try again.');
          } else if (event.error === 'audio-capture') {
            alert('Microphone access denied. Please allow microphone access and try again.');
          } else if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access and try again.');
          } else {
            alert(`Speech recognition error: ${event.error}`);
          }
        };
        
        recognitionRef.current.onend = () => {
          setRecognizing(false);
          if (text.trim()) {
            handleCheckCacheAndGenerateOptions(false);
          }
        };
      }
      
      recognitionRef.current.start();
      setRecognizing(true);
    }
  };

  const handleRecognizeContextSpeech = () => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!contextRecognitionRef.current) {
      contextRecognitionRef.current = new SpeechRecognition();
      
      // Enhanced configuration for better recognition
      contextRecognitionRef.current.continuous = true;
      contextRecognitionRef.current.interimResults = true; // Enable interim results for better UX
      contextRecognitionRef.current.lang = "en-US";
      contextRecognitionRef.current.maxAlternatives = 3; // Get multiple alternatives
      contextRecognitionRef.current.serviceURI = "";
      
      // Enhanced result processing
      contextRecognitionRef.current.onresult = (event: unknown) => {
        const speechEvent = event as SpeechRecognitionEvent;
        let fullTranscript = "";
        let interimTranscript = "";
        
        for (let i = 0; i < speechEvent.results.length; i++) {
          const result = speechEvent.results[i];
          const transcript = result[0].transcript.trim();
          const confidence = result[0].confidence;
          
          // Only use results with good confidence
          if (confidence > 0.7) {
            if (result.isFinal) {
              let processedTranscript = transcript;
              
              // Enhanced text processing
              processedTranscript = improvePunctuation(transcript);
              
              fullTranscript += (fullTranscript ? " " : "") + processedTranscript;
            } else {
              interimTranscript += transcript;
            }
          }
        }
        
        // Update context with both final and interim results
        const displayText = fullTranscript + (interimTranscript ? ` ${interimTranscript}` : '');
        setContext(displayText);
      };
      
      contextRecognitionRef.current.onerror = (event: any) => {
        console.error('Context speech recognition error:', event.error);
        setContextRecognizing(false);
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'audio-capture') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };
      
      contextRecognitionRef.current.onend = () => {
        setContextRecognizing(false);
      };
    }
    
    if (contextRecognizing) {
      contextRecognitionRef.current.stop();
      setContextRecognizing(false);
    } else {
      contextRecognitionRef.current.start();
      setContextRecognizing(true);
    }
  };

  const handleCheckCacheAndGenerateOptions = async (isRegen: boolean) => {
    setLoading(true);
    setError("");
    
    try {
      const fullPrompt = context ? `Context: ${context}\n\nQuestion: ${text}` : text;
      
      console.log('Making single API call for prompt:', fullPrompt);
      console.log('User profile being sent:', userProfile);
      
      // Single API call - backend will check cache first, then generate if needed
      const res = await fetch("/api/generate-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: fullPrompt, 
          regenerate: isRegen,
          userProfile: userProfile // Send user profile data
        }),
      });
      
      const data = await res.json();
      console.log('API response:', data);
      
      if (data.error) {
        setError(data.error);
        setOptions(["", "", "", ""]);
        return;
      }
      
      if (data.options) {
        console.log('Raw options from API:', data.options);
        
        // Parse options from the API response
        let opts: string[] = [];
        
        // Split by newlines and parse A) B) C) D) format
        const lines = data.options.split(/\n|\r/).filter((line: string) => line.trim());
        opts = lines.slice(0, 4).map((line: string) => {
          // Remove the A) B) C) D) prefix and trim
          const match = line.match(/^[A-D]\)\s*(.*)$/);
          return match ? match[1].trim() : line.trim();
        });
        
        console.log('Parsed options:', opts);
        
        // Ensure we have exactly 4 options
        if (opts.length === 4) {
          setOptions(opts);
          console.log(`Options set (cached: ${data.cached})`);
        } else {
          // Fallback: put the entire response in first option, others empty
          setOptions([data.options, "", "", ""]);
          console.log('Fallback: using entire response as first option');
        }
      } else {
        setError("No options returned from API.");
        setOptions(["", "", "", ""]);
      }
    } catch (error) {
      console.error('API call failed:', error);
      setError("Failed to generate options. Please try again.");
      setOptions(["", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakText = async () => {
    if (!text.trim()) {
      alert("Please enter text or recognize speech first.");
      return;
    }
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    // Just speak the text in the text box, no API call
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

  const handleSpeakAllOptions = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    
    // // Filter out empty options 
    // const nonEmptyOptions = options.filter(option => option.trim() !== "");
    
    // if (nonEmptyOptions.length === 0) {
    //   alert("No options available to speak.");
    //   return;
    // }
    
    // Create a queue of utterances
    const utterances = options.map((option, index) => {
      const utterance = new window.SpeechSynthesisUtterance(option);
        // Add a small pause between options
        utterance.onstart = () => {
          if(option.trim() !== "") {
            setClicked(index);
          }
        }
        utterance.onend = () => {
          if (index < options.length - 1) {
            if(options[index+1].trim() !== "") {
              // Add a small delay before speaking the next option
              setTimeout(() => {
                // setClicked(index+1);
                console.log("speaking this now : ", index+1);
                window.speechSynthesis.speak(utterances[index + 1]);
              }, 500);
            }
            else {
              window.speechSynthesis.speak(utterances[index + 1]);
            }
          }
          setClicked(-1);
        };
      return utterance;
    });
    
    // Start speaking the first option 
    // setClicked(0);
    window.speechSynthesis.speak(utterances[0]);
  };

  return (
    <Container>
      <ContextTextAreaContainer>
        <ContextTextArea
          placeholder="Add any context or background information here..."
          value={context}
          onChange={e => setContext(e.target.value)}
        />
        <ContextMicIcon $recognizing={contextRecognizing} onClick={handleRecognizeContextSpeech} $right={52}>
          {contextRecognizing ? <FaStop /> : <FaMicrophone />}
        </ContextMicIcon>
        <ContextClearButton
          type="button"
          aria-label="Clear context"
          onMouseDown={e => e.preventDefault()}
          onClick={() => setContext("")}
        >
          <FaTimes />
        </ContextClearButton>
      </ContextTextAreaContainer>
      <TextAreaContainer>
        <TextAreaWithIcon
          placeholder="Type or speak your question here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <MicIcon $recognizing={recognizing} onClick={handleRecognizeSpeech}>
          {recognizing ? <FaStop /> : <FaMicrophone />}
        </MicIcon>
        <SpeakerIcon onClick={handleSpeakText}>
          <FaVolumeUp />
        </SpeakerIcon>
      </TextAreaContainer>
      <OptionsContainer>
        <ButtonRow>
          <SmallButton onClick={() => handleCheckCacheAndGenerateOptions(true)} disabled={loading || !text}>
            {loading ? "Generating options..." : "Regenerate Options"}
          </SmallButton>
          <SmallButton onClick={handleSpeakAllOptions} disabled={options.every(option => option.trim() === "")}>
            Speak All Options
          </SmallButton>
        </ButtonRow>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <OptionsRow>
          <OptionButton $clicked = {clicked === 0} onClick={() => handleSpeakOption(options[0], 0)}>{options[0]}</OptionButton>
          <OptionButton $clicked = {clicked === 1} onClick={() => handleSpeakOption(options[1], 1)}>{options[1]}</OptionButton>
        </OptionsRow>
        <OptionsRow>
          <OptionButton $clicked = {clicked === 2} onClick={() => handleSpeakOption(options[2], 2)}>{options[2]}</OptionButton>
          <OptionButton $clicked = {clicked === 3} onClick={() => handleSpeakOption(options[3], 3)}>{options[3]}</OptionButton>
        </OptionsRow>
      </OptionsContainer>
    </Container>
  );
} 