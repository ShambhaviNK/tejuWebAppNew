"use client";
import React, { useState, useRef, useEffect} from "react";
import { FaMicrophone, FaStop, FaVolumeUp } from "react-icons/fa";
import { Container, Title, Button, ContextTextArea, ContextTextAreaContainer, ContextMicIcon, TextAreaContainer, TextAreaWithIcon, MicIcon, SpeakerIcon, OptionsRow, OptionButton, ErrorMsg } from "./MainInterface.styles";

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
  const accumulatedTranscriptRef = useRef("");
  const [clicked, setClicked] = useState(-1);

  useEffect(() => {
    console.log("Updated options:", options);
  }, [options]);

  const handleRecognizeSpeech = () => {
    if(recognizing && text.trim()) {
      recognitionRef.current.stop();
      setRecognizing(false);
      handleCheckCacheAndGenerateOptions();
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
        recognitionRef.current.serviceURI = ""; // Use default service
        
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
                processedTranscript = processedTranscript.charAt(0).toUpperCase() + processedTranscript.slice(1);
                
                // Better punctuation handling
                if (!/[.!?]$/.test(processedTranscript)) {
                  processedTranscript += ".";
                }
                
                // Enhanced conjunction formatting
                processedTranscript = processedTranscript.replace(/\s(and|but|so|or|however|therefore|meanwhile|furthermore|moreover|nevertheless|consequently|accordingly|thus|hence|as\s+a\s+result)\s/gi, ", $1 ");
                
                // Fix common speech recognition errors
                processedTranscript = processedTranscript
                  .replace(/\b(um|uh|er|ah)\b/gi, '') // Remove filler words
                  .replace(/\s+/g, ' ') // Fix multiple spaces
                  .replace(/\s+([,.!?])/g, '$1') // Fix spacing around punctuation
                  .trim();
                
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
        
        // Enhanced error handling
        recognitionRef.current.onerror = (event: unknown) => {
          const errorEvent = event as { error: string };
          console.error('Speech recognition error:', errorEvent.error);
          
          let errorMessage = "Speech recognition error: ";
          switch (errorEvent.error) {
            case 'no-speech':
              errorMessage += "No speech detected. Please try speaking again.";
              break;
            case 'audio-capture':
              errorMessage += "Audio capture failed. Please check your microphone.";
              break;
            case 'not-allowed':
              errorMessage += "Microphone access denied. Please allow microphone access.";
              break;
            case 'network':
              errorMessage += "Network error. Please check your internet connection.";
              break;
            case 'service-not-allowed':
              errorMessage += "Speech recognition service not available.";
              break;
            default:
              errorMessage += errorEvent.error;
          }
          
          setError(errorMessage);
          setRecognizing(false);
        };
        
        // Enhanced end handling
        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setRecognizing(false);
        };
        
        // Add start handling
        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setError(""); // Clear any previous errors
        };
        
        // Add audio start/end handling
        recognitionRef.current.onaudiostart = () => {
          console.log('Audio capturing started');
        };
        
        recognitionRef.current.onaudioend = () => {
          console.log('Audio capturing ended');
        };
        
        recognitionRef.current.onsoundstart = () => {
          console.log('Sound detected');
        };
        
        recognitionRef.current.onsoundend = () => {
          console.log('Sound ended');
        };
        
        recognitionRef.current.onspeechstart = () => {
          console.log('Speech started');
        };
        
        recognitionRef.current.onspeechend = () => {
          console.log('Speech ended');
        };
      }
      
      if (!recognizing) {
        accumulatedTranscriptRef.current = "";
        try {
          recognitionRef.current.start();
          setRecognizing(true);
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          setError("Failed to start speech recognition. Please try again.");
        }
      } else {
        recognitionRef.current.stop();
        setRecognizing(false);
      }
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
      contextRecognitionRef.current.serviceURI = ""; // Use default service
      
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
              processedTranscript = processedTranscript.charAt(0).toUpperCase() + processedTranscript.slice(1);
              
              // Better punctuation handling
              if (!/[.!?]$/.test(processedTranscript)) {
                processedTranscript += ".";
              }
              
              // Enhanced conjunction formatting
              processedTranscript = processedTranscript.replace(/\s(and|but|so|or|however|therefore|meanwhile|furthermore|moreover|nevertheless|consequently|accordingly|thus|hence|as\s+a\s+result)\s/gi, ", $1 ");
              
              // Fix common speech recognition errors
              processedTranscript = processedTranscript
                .replace(/\b(um|uh|er|ah)\b/gi, '') // Remove filler words
                .replace(/\s+/g, ' ') // Fix multiple spaces
                .replace(/\s+([,.!?])/g, '$1') // Fix spacing around punctuation
                .trim();
              
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
      
      // Enhanced error handling
      contextRecognitionRef.current.onerror = (event: unknown) => {
        const errorEvent = event as { error: string };
        console.error('Context speech recognition error:', errorEvent.error);
        
        let errorMessage = "Context speech recognition error: ";
        switch (errorEvent.error) {
          case 'no-speech':
            errorMessage += "No speech detected. Please try speaking again.";
            break;
          case 'audio-capture':
            errorMessage += "Audio capture failed. Please check your microphone.";
            break;
          case 'not-allowed':
            errorMessage += "Microphone access denied. Please allow microphone access.";
            break;
          case 'network':
            errorMessage += "Network error. Please check your internet connection.";
            break;
          case 'service-not-allowed':
            errorMessage += "Speech recognition service not available.";
            break;
          default:
            errorMessage += errorEvent.error;
        }
        
        setError(errorMessage);
        setContextRecognizing(false);
      };
      
      // Enhanced end handling
      contextRecognitionRef.current.onend = () => {
        console.log('Context speech recognition ended');
        setContextRecognizing(false);
      };
      
      // Add start handling
      contextRecognitionRef.current.onstart = () => {
        console.log('Context speech recognition started');
        setError(""); // Clear any previous errors
      };
      
      // Add audio start/end handling
      contextRecognitionRef.current.onaudiostart = () => {
        console.log('Context audio capturing started');
      };
      
      contextRecognitionRef.current.onaudioend = () => {
        console.log('Context audio capturing ended');
      };
      
      contextRecognitionRef.current.onsoundstart = () => {
        console.log('Context sound detected');
      };
      
      contextRecognitionRef.current.onsoundend = () => {
        console.log('Context sound ended');
      };
      
      contextRecognitionRef.current.onspeechstart = () => {
        console.log('Context speech started');
      };
      
      contextRecognitionRef.current.onspeechend = () => {
        console.log('Context speech ended');
      };
    }
    
    if (!contextRecognizing) {
      try {
        contextRecognitionRef.current.start();
        setContextRecognizing(true);
      } catch (error) {
        console.error('Failed to start context speech recognition:', error);
        setError("Failed to start context speech recognition. Please try again.");
      }
    } else {
      contextRecognitionRef.current.stop();
      setContextRecognizing(false);
    }
  };

  const handleCheckCacheAndGenerateOptions = async () => {
    setLoading(true);
    setError("");
    
    try {
      const fullPrompt = context ? `Context: ${context}\n\nQuestion: ${text}` : text;
      
      console.log('Making single API call for prompt:', fullPrompt);
      
      // Single API call - backend will check cache first, then generate if needed
      const res = await fetch("/api/generate-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, regenerate: false }),
      });
      
      const data = await res.json();
      console.log('API response:', data);
      
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
          console.log(`Options set (cached: ${data.cached})`);
        } else {
          setOptions([data.options, "", "", ""]);
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

  const handleGenerateOptions = async () => {
    setLoading(true);
    setError("");
    
    try {
      const fullPrompt = context ? `Context: ${context}\n\nQuestion: ${text}` : text;
      
      const res = await fetch("/api/generate-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, regenerate: true }),
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
          console.log(`Options generated (cached: ${data.cached})`);
        } else {
          setOptions([data.options, "", "", ""]);
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

    // Check if we have cached options for this question
    try {
      const fullPrompt = context ? `Context: ${context}\n\nQuestion: ${text}` : text;
      const res = await fetch("/api/generate-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, regenerate: false }), // Don't regenerate, just check cache
      });
      
      const data = await res.json();
      if (data.options && data.cached) {
        // Speak the cached options
        const optionsText = data.options.split('\n').join('. ');
        const utterance = new window.SpeechSynthesisUtterance(`Here are the options: ${optionsText}`);
        window.speechSynthesis.speak(utterance);
        console.log('Speaking cached options');
      } else {
        // Speak the question text
        const utterance = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        console.log('Speaking question text');
      }
    } catch (error) {
      console.error('Error checking cache:', error);
      // Fallback to speaking the question text
      const utterance = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
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
      <ContextTextAreaContainer>
        <ContextTextArea
          placeholder="Add any context or background information here..."
          value={context}
          onChange={e => setContext(e.target.value)}
        />
        <ContextMicIcon $recognizing={contextRecognizing} onClick={handleRecognizeContextSpeech}>
          {contextRecognizing ? <FaStop /> : <FaMicrophone />}
        </ContextMicIcon>
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
      <Button onClick={handleCheckCacheAndGenerateOptions} disabled={loading || !text}>
        {loading ? "Generating..." : "Regenerate Options"}
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