"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextArea } from "../components/MainInterface.styles";
import { FaArrowLeft, FaVolumeUp } from "react-icons/fa";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./page.css";

// Profanity filter - comprehensive list of inappropriate words to exclude
const inappropriateWords = new Set([
  // Common profanities (censored for safety)
  "fuck", "shit", "bitch", "ass", "crap", "piss", "dick", "cock", "pussy", "cunt",
  "fucking", "shitting", "bitching", "asshole", "pissing", "dicking",
  "fucker", "shitter", "bitchy", "asshat", "hellfire", "crapper", "pisser", "dickhead",
  "motherfucker", "bullshit", "horseshit", "dumbass", "smartass", "jackass", "badass", "hardass",
  "fuckin", "shittin", "bitchin", "asshole", "damnit", "hellish", "pissin", "dickin",
  
  // Common misspellings and variations
  "fuk", "shyt", "bich", "azz", "krap", "piz", "dik", "kok", "pusy", "kunt",
  "fukin", "shytin", "bichin", "azzhole", "dammit", "helfire", "krapper", "pizer", "dikhead",
  "muthafuka", "bullshyt", "horseshyt", "dumbazz", "smartazz", "jackazz", "badazz", "hardazz",
  
  // Leetspeak variations
  "f*ck", "sh*t", "b*tch", "a$$", "d*mn", "h*ll", "cr*p", "p*ss", "d*ck", "c*ck", "p*ssy", "c*nt",
  "f*cking", "sh*tting", "b*tching", "a$$hole", "d*mned", "h*llish", "cr*ppy", "p*ssing", "d*cking",
    
  // Offensive terms
  "nigger", "nigga", "faggot", "fag", "dyke", "whore", "slut", "hoe", "skank", "tramp",
  "n*gger", "n*gga", "f*ggot", "f*g", "d*ke", "wh*re", "sl*t", "h*e", "sk*nk", "tr*mp",
  
  // Racial slurs and offensive terms
  "chink", "spic", "kike", "wop", "dago", "kraut", "jap", "gook", "ch*nk", "sp*c", "k*ke", "w*p",
  
  // Common offensive phrases
  "suck", "blow", "jerk", "wank", "fap", "cum", "jizz", "semen", "penis", "vagina", "boob", "tit",
  "s*ck", "bl*w", "j*rk", "w*nk", "f*p", "c*m", "j*zz", "s*men", "p*nis", "v*gina", "b*ob", "t*t"
]);

// Function to check if a word is inappropriate
const isInappropriateWord = (word: string): boolean => {
  const lowerWord = word.toLowerCase();
  
  // Check exact matches
  if (inappropriateWords.has(lowerWord)) {
    return true;
  }
  
  // Check if word contains any inappropriate substring
  for (const badWord of inappropriateWords) {
    if (lowerWord.includes(badWord) || badWord.includes(lowerWord)) {
      return true;
    }
  }
  
  // Check for common patterns (like adding numbers or special characters)
  const cleanWord = lowerWord.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
  if (inappropriateWords.has(cleanWord)) {
    return true;
  }
  
  return false;
};

// Enhanced word prediction system with profanity filter
const commonWords = [
  // Most common words (highest priority)
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  
  // Verb forms and conjugations
  "is", "are", "was", "were", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "can", "must",
  "am", "going", "went", "gone", "see", "saw", "seen", "come", "came", "get", "got", "gotten", "make", "made", "know", "knew", "known", "think", "thought",
  
  // Question words and pronouns
  "here", "there", "where", "when", "why", "how", "what", "which", "who", "whom", "whose", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their",
  
  // Adverbs and modifiers
  "yes", "no", "not", "never", "always", "sometimes", "often", "usually", "rarely", "very", "really", "quite", "rather", "too", "so", "much", "many", "few", "little",
  "more", "most", "less", "least", "better", "best", "worse", "worst", "faster", "fastest", "slower", "slowest",
  
  // Adjectives
  "big", "small", "large", "tiny", "huge", "enormous", "great", "good", "bad", "nice", "beautiful", "ugly", "happy", "sad", "angry", "excited", "tired", "hungry", "thirsty", "hot", "cold", "warm", "cool",
  "new", "old", "young", "fresh", "clean", "dirty", "bright", "dark", "light", "heavy", "easy", "hard", "simple", "complex", "important", "necessary", "possible", "impossible",
  
  // Time-related
  "today", "tomorrow", "yesterday", "morning", "afternoon", "evening", "night", "week", "month", "year", "hour", "minute", "second", "now", "then", "soon", "later", "early", "late",
  
  // Social and communication
  "please", "thank", "sorry", "excuse", "pardon", "hello", "goodbye", "welcome", "congratulations", "thanks", "appreciate", "understand", "agree", "disagree", "help", "support",
  
  // Technology and modern words
  "email", "phone", "computer", "internet", "website", "app", "online", "offline", "download", "upload", "share", "like", "follow", "post", "message", "text", "call", "video",
  
  // Common phrases and contractions
  "don't", "can't", "won't", "isn't", "aren't", "wasn't", "weren't", "hasn't", "haven't", "doesn't", "didn't", "wouldn't", "couldn't", "shouldn't", "let's", "that's", "it's", "he's", "she's", "we're", "they're", "you're", "I'm"
].filter(word => !isInappropriateWord(word)); // Filter out any inappropriate words from the list

// Word frequency data for better ranking
const wordFrequency: { [key: string]: number } = {
  "the": 100, "be": 95, "to": 90, "of": 85, "and": 80, "a": 75, "in": 70, "that": 65, "have": 60, "I": 55,
  "it": 50, "for": 45, "not": 40, "on": 35, "with": 30, "he": 25, "as": 20, "you": 15, "do": 10, "at": 5
};

// Common word pairs for better context
const wordPairs: { [key: string]: string[] } = {
  "the": ["best", "most", "only", "same", "other", "new", "good", "big", "small", "first", "last", "next", "previous", "current", "main", "important"],
  "is": ["good", "bad", "great", "nice", "beautiful", "wonderful", "amazing", "perfect", "ready", "available", "possible", "necessary", "important"],
  "I": ["am", "will", "would", "could", "should", "think", "know", "want", "like", "love", "need", "have", "can", "must", "should"],
  "you": ["are", "will", "would", "could", "should", "think", "know", "want", "like", "need", "can", "must", "should", "have"],
  "we": ["are", "will", "would", "could", "should", "think", "know", "want", "like", "need", "can", "must", "have"],
  "they": ["are", "will", "would", "could", "should", "think", "know", "want", "like", "need", "can", "have"],
  "this": ["is", "was", "will", "can", "should", "could", "would", "has", "had", "does", "did"],
  "that": ["is", "was", "will", "can", "should", "could", "would", "has", "had", "does", "did"],
  "what": ["is", "was", "will", "can", "should", "could", "would", "has", "had", "does", "did", "do", "are", "were"],
  "how": ["are", "is", "was", "were", "will", "can", "should", "could", "would", "do", "does", "did"],
  "when": ["is", "was", "will", "can", "should", "could", "would", "do", "does", "did", "are", "were"],
  "where": ["is", "was", "will", "can", "should", "could", "would", "do", "does", "did", "are", "were"],
  "why": ["is", "was", "will", "can", "should", "could", "would", "do", "does", "did", "are", "were"]
};

// Dictionary API endpoint
const DICTIONARY_API = "https://api.datamuse.com/words";


export default function KeyboardPage() {
  const [checked, setChecked] = useState(true);
  const [caps, setCaps] = useState(false);
  const [isNumberMode, setIsNumberMode] = useState(false);
  const [isLettersOnly, setIsLettersOnly] = useState(false);
  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dictionaryCache, setDictionaryCache] = useState<{[key: string]: string[]}>({});
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [storedTexts, setStoredTexts] = useState<{[date: string]: string[]}>(() => {
    // Load stored texts from localStorage on component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('keyboardStoredTexts');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [showStoredTexts, setShowStoredTexts] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const keyboardRef = useRef<any>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Track screen size changes
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Focus text area when component mounts
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Save stored texts to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('keyboardStoredTexts', JSON.stringify(storedTexts));
    }
  }, [storedTexts]);

  const handleClick = () => {
    setChecked(!checked);
    // If we're in number mode, switch back to letters mode
    if (isNumberMode) {
      setIsNumberMode(false);
      setIsLettersOnly(false);
    } else {
      setIsLettersOnly(false);
    }
  }

  const handleNumberToggle = () => {
    setIsNumberMode(!isNumberMode);
    if (!isNumberMode) {
      setIsLettersOnly(true);
    }
  }

  const handleStoreText = () => {
    if (text.trim()) {
      const today = new Date().toLocaleDateString();
      setStoredTexts(prev => ({
        ...prev,
        [today]: [...(prev[today] || []), text]
      }));
      setText(""); // Clear the text after storing
      setPredictions([]); // Clear predictions
    }
  }

  const handleShowStoredTexts = () => {
    setShowStoredTexts(!showStoredTexts);
  }

  const handleLoadStoredText = (text: string) => {
    setText(text);
    setShowStoredTexts(false);
    // Focus back to text area
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(text.length, text.length);
      }
    }, 0);
  }

  const handleDeleteStoredText = (date: string, index: number) => {
    setStoredTexts(prev => {
      const newStoredTexts = { ...prev };
      newStoredTexts[date] = newStoredTexts[date].filter((_, i) => i !== index);
      if (newStoredTexts[date].length === 0) {
        delete newStoredTexts[date];
      }
      return newStoredTexts;
    });
  }

  const handleClearAllStoredTexts = () => {
    if (window.confirm('Are you sure you want to delete all stored texts? This action cannot be undone.')) {
      setStoredTexts({});
    }
  }

  const handleSpeakOption = (text: string) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Debounced word prediction to reduce API calls
  const debouncedGetWordPredictions = (text: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(() => {
      getWordPredictions(text);
    }, 300); // Wait 300ms after user stops typing
    
    setDebounceTimer(timer);
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
          word.toLowerCase().startsWith(prefix.toLowerCase()) && 
          word.length > prefix.length &&
          !isInappropriateWord(word) // Filter out inappropriate words from API
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

  // Enhanced word prediction function with improved ranking
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

    // Get common word predictions with frequency ranking and profanity filter
    const commonSuggestions = commonWords
      .filter(word => word.toLowerCase().startsWith(currentWord.toLowerCase()))
      .filter(word => !isInappropriateWord(word)) // Filter out inappropriate words
      .sort((a, b) => (wordFrequency[b] || 0) - (wordFrequency[a] || 0))
      .slice(0, 5);

    // Get dictionary-based predictions
    const dictionaryPredictions = await fetchDictionaryWords(currentWord);
    
    // Combine and rank all suggestions with profanity filter
    const allSuggestions = [...commonSuggestions, ...dictionaryPredictions]
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .filter(word => !isInappropriateWord(word)) // Filter out inappropriate words
      .sort((a, b) => {
        // Prioritize common words over dictionary words
        const aIsCommon = commonWords.includes(a.toLowerCase());
        const bIsCommon = commonWords.includes(b.toLowerCase());
        
        if (aIsCommon && !bIsCommon) return -1;
        if (!aIsCommon && bIsCommon) return 1;
        
        // If both are common, use frequency ranking
        if (aIsCommon && bIsCommon) {
          return (wordFrequency[b] || 0) - (wordFrequency[a] || 0);
        }
        
        // For dictionary words, prefer shorter words
        return a.length - b.length;
      })
      .slice(0, 5);

    setPredictions(allSuggestions);
  };

  // Enhanced next word prediction with better context awareness
  const getNextWordPredictions = async (previousText: string) => {
    const words = previousText.split(' ').filter(word => word.length > 0);
    const lastWord = words[words.length - 1] || '';
    
    // Enhanced context-based word suggestions
    const contextWords = {
      question: ["what", "when", "where", "why", "how", "which", "who", "is", "are", "can", "will", "would", "could", "do", "does", "did"],
      greeting: ["hello", "hi", "good", "morning", "afternoon", "evening", "how", "are", "you", "nice", "meet", "doing", "going", "feeling"],
      weather: ["sunny", "rainy", "cloudy", "hot", "cold", "warm", "cool", "temperature", "weather", "today", "tomorrow", "forecast", "nice", "bad"],
      food: ["hungry", "eat", "food", "meal", "breakfast", "lunch", "dinner", "snack", "delicious", "tasty", "good", "bad", "restaurant", "cooking"],
      time: ["today", "tomorrow", "yesterday", "morning", "afternoon", "evening", "night", "time", "hour", "minute", "week", "month", "year", "now", "later"],
      work: ["work", "job", "office", "meeting", "project", "task", "deadline", "busy", "free", "available", "schedule", "appointment"],
      technology: ["computer", "phone", "internet", "app", "website", "email", "message", "call", "text", "online", "download", "upload"],
      emotions: ["happy", "sad", "excited", "worried", "angry", "surprised", "confused", "tired", "energetic", "relaxed", "stressed", "calm"]
    };

    // Enhanced context detection
    let contextType = "";
    const previousWords = words.join(' ').toLowerCase();
    
    if (previousWords.includes('?')) contextType = "question";
    else if (previousWords.includes('hello') || previousWords.includes('hi') || previousWords.includes('hey')) contextType = "greeting";
    else if (previousWords.includes('weather') || previousWords.includes('sunny') || previousWords.includes('rainy') || previousWords.includes('temperature')) contextType = "weather";
    else if (previousWords.includes('hungry') || previousWords.includes('eat') || previousWords.includes('food') || previousWords.includes('meal')) contextType = "food";
    else if (previousWords.includes('time') || previousWords.includes('today') || previousWords.includes('tomorrow') || previousWords.includes('schedule')) contextType = "time";
    else if (previousWords.includes('work') || previousWords.includes('job') || previousWords.includes('office') || previousWords.includes('meeting')) contextType = "work";
    else if (previousWords.includes('computer') || previousWords.includes('phone') || previousWords.includes('internet') || previousWords.includes('app')) contextType = "technology";
    else if (previousWords.includes('happy') || previousWords.includes('sad') || previousWords.includes('excited') || previousWords.includes('worried')) contextType = "emotions";

    // Get context-appropriate words
    let suggestions: string[] = [];
    if (contextType && contextWords[contextType as keyof typeof contextWords]) {
      suggestions = contextWords[contextType as keyof typeof contextWords].slice(0, 3);
    }

    // Use word pairs for better next word prediction
    let pairSuggestions: string[] = [];
    if (wordPairs[lastWord.toLowerCase()]) {
      pairSuggestions = wordPairs[lastWord.toLowerCase()];
    }

    // Add high-frequency common words
    const highFrequencyWords = ["the", "a", "an", "is", "are", "was", "were", "will", "would", "could", "should", "in", "on", "at", "to", "for", "of", "with", "by", "from", "about", "like"];

    // Combine all suggestions with smart ranking and profanity filter
    const allSuggestions = [
      ...pairSuggestions,           // Word pairs (highest priority)
      ...suggestions,               // Context words
      ...highFrequencyWords,        // High-frequency words
      ...commonWords.slice(0, 20)   // Top common words
    ]
    .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
    .filter(word => !isInappropriateWord(word)) // Filter out inappropriate words
    .sort((a, b) => {
      // Prioritize word pairs
      const aIsPair = pairSuggestions.includes(a);
      const bIsPair = pairSuggestions.includes(b);
      if (aIsPair && !bIsPair) return -1;
      if (!aIsPair && bIsPair) return 1;
      
      // Then prioritize context words
      const aIsContext = suggestions.includes(a);
      const bIsContext = suggestions.includes(b);
      if (aIsContext && !bIsContext) return -1;
      if (!aIsContext && bIsContext) return 1;
      
      // Finally use frequency ranking
      return (wordFrequency[b] || 0) - (wordFrequency[a] || 0);
    })
    .slice(0, 5);

    setPredictions(allSuggestions);
  };

  const handlePredictionClick = (prediction: string) => {
    const words = text.split(' ');
    words[words.length - 1] = prediction;
    const newText = words.join(' ') + ' ';
    setText(newText);
    setPredictions([]);
    
    // Refocus text area after prediction selection to maintain cursor visibility
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        // Set cursor to end of text
        textAreaRef.current.setSelectionRange(newText.length, newText.length);
      }
    }, 0);
  };

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
    } else if (button === "{abc}") {
      setIsNumberMode(false);
      setIsLettersOnly(true);
      return;
    } else if (button === "{123}") {
      setIsNumberMode(true);
      return;
    } else if (!button.startsWith("{")) {
      newText = text.slice(0, cursor_pos) + button + text.slice(cursor_pos);
    }

    setText(newText);
    debouncedGetWordPredictions(newText);
    
    // Refocus text area after keyboard input to maintain cursor visibility
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        // Set cursor position to maintain where user was typing
        textAreaRef.current.setSelectionRange(cursor_pos + (button === "{bksp}" ? -1 : button.length), cursor_pos + (button === "{bksp}" ? -1 : button.length));
      }
    }, 0);
  };

  // Calculate dynamic layout based on screen size and orientation
  const isMobile = screenSize.width <= 768;
  const isTablet = screenSize.width > 768 && screenSize.width <= 1024;
  const isLandscape = screenSize.width > screenSize.height;
  
  // Fixed button size calculation - not affected by suggestions
  const getButtonSize = () => {
    if (isMobile && isLandscape) {
      return 'clamp(45px, 12vw, 80px)';
    } else if (isMobile) {
      return 'clamp(65px, 15vw, 110px)';
    } else if (isTablet) {
      return 'clamp(75px, 13vw, 130px)';
    } else {
      return 'clamp(85px, 11vw, 150px)';
    }
  };

  return (
    <>
    <div style={{
      width: '100vw',
        minHeight: '100vh',
        background: "#23242a",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      boxSizing: 'border-box',
      padding: 0,
        position: 'relative',
        top: 0,
        left: 0,
        zIndex: 1,
        overflow: 'auto'
      }}>
        {/* Top Content Area */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: isMobile ? '16px' : '32px',
          paddingBottom: isMobile ? '16px' : '32px',
          position: 'relative',
          flex: 1
        }}>
          {/* Back Button */}
          <button onClick={() => router.push("/")}
        style={{
              position: "absolute",
              top: isMobile ? '16px' : '32px',
              left: isMobile ? '16px' : '32px',
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
          borderRadius: "50%",
          background: "#2196f3",
          color: "#fff",
          border: "2px solid #fff2",
          boxShadow: "0 2px 12px rgba(33,150,243,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
              fontSize: isMobile ? 20 : 26,
          cursor: "pointer",
          transition: "background 0.2s, border 0.2s",
              zIndex: 1000,
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#1976d2')}
        onMouseOut={e => (e.currentTarget.style.background = '#2196f3')}
            aria-label="Back"><FaArrowLeft></FaArrowLeft></button>
          {/* Text Input Area */}
      <div style={{
            width: '100%', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: isMobile ? '50px' : '70px',
            marginRight: 'auto',
            marginBottom: 0,
            marginLeft: 'auto'
          }}>
            <div style={{ position: 'relative', width: isMobile ? '400px' : '600px' }}>
              <TextArea
                ref={textAreaRef}
            placeholder="Enter your message here..."
            value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  debouncedGetWordPredictions(e.target.value);
                }}
                onFocus={() => {
                  // Ensure cursor is visible when text area is focused
                  if (textAreaRef.current) {
                    textAreaRef.current.setSelectionRange(text.length, text.length);
                  }
                }}
            style={{
                fontSize: isMobile ? '16px' : '18px',
                padding: isMobile ? '12px 50px 12px 16px' : '16px 60px 16px 20px',
                borderRadius: isMobile ? 12 : 16,
              border: "2px solid #2196f3",
              width: "100%",
                minHeight: isMobile ? 45 : 55,
                maxHeight: isMobile ? 45 : 55,
              background: "#181920",
              color: "#fff",
              outline: "none",
              resize: "none",
              boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              transition: 'border 0.2s',
                lineHeight: '1.2',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'thin',
                scrollbarColor: '#2196f3 #181920'
            }}
          />
          <button
            onClick={() => handleSpeakOption(text)}
            style={{
              position: 'absolute',
                  right: isMobile ? 12 : 18,
                  top: '50%',
              transform: 'translateY(-50%)',
              background: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
                  fontSize: isMobile ? 20 : 28,
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
              marginTop: isMobile ? '16px' : '24px',
              marginRight: 'auto',
              marginBottom: 0,
              marginLeft: 'auto',
              padding: isMobile ? '12px' : '16px',
              background: 'rgba(33, 150, 243, 0.05)',
              borderRadius: isMobile ? '12px' : '16px',
              border: '1px solid rgba(33, 150, 243, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: isMobile ? '10px' : '12px',
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
                gap: isMobile ? '6px' : '8px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {isLoading ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#2196f3',
                    fontSize: isMobile ? '12px' : '14px'
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
                      padding: isMobile ? '6px 12px' : '8px 16px',
                      fontSize: isMobile ? '12px' : '14px',
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
        </div>

        {/* Layout Toggle Buttons - Above Keyboard */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: isMobile ? '8px' : '12px',
          padding: isMobile ? '8px 16px' : '12px 24px',
          marginBottom: isMobile ? '8px' : '12px',
          background: 'transparent'
        }}>
          <button 
            onClick={handleClick} 
            type="button" 
            style={{
              fontSize: isMobile ? '12px' : '14px',
              padding: isMobile ? '8px 16px' : '10px 20px',
              borderRadius: '12px',
              background: '#007aff',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#0056cc';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#007aff';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 122, 255, 0.3)';
            }}
          >
            {checked ? "ABCD" : "QWERTY"}
          </button>
          
          <button 
            onClick={handleNumberToggle} 
            type="button" 
          style={{
              fontSize: isMobile ? '12px' : '14px',
              padding: isMobile ? '8px 16px' : '10px 20px',
              borderRadius: '12px',
              background: isNumberMode ? '#34c759' : '#007aff',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '500',
              boxShadow: isNumberMode ? '0 2px 8px rgba(52, 199, 89, 0.3)' : '0 2px 8px rgba(0, 122, 255, 0.3)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = isNumberMode ? '#28a745' : '#0056cc';
              e.currentTarget.style.boxShadow = isNumberMode ? '0 4px 12px rgba(52, 199, 89, 0.4)' : '0 4px 12px rgba(0, 122, 255, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = isNumberMode ? '#34c759' : '#007aff';
              e.currentTarget.style.boxShadow = isNumberMode ? '0 2px 8px rgba(52, 199, 89, 0.3)' : '0 2px 8px rgba(0, 122, 255, 0.3)';
            }}
          >
            {isNumberMode ? "ABC" : "123"}
          </button>

                <button
            onClick={handleStoreText} 
            type="button" 
                  style={{
              fontSize: isMobile ? '12px' : '14px',
              padding: isMobile ? '8px 16px' : '10px 20px',
              borderRadius: '12px',
              background: '#ff9500',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(255, 149, 0, 0.3)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#e6850e';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 149, 0, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#ff9500';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 149, 0, 0.3)';
            }}
          >
            Store
          </button>

          <button 
            onClick={handleShowStoredTexts} 
            type="button" 
            style={{
              fontSize: isMobile ? '12px' : '14px',
              padding: isMobile ? '8px 16px' : '10px 20px',
              borderRadius: '12px',
              background: showStoredTexts ? '#5856d6' : '#ff3b30',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '500',
              boxShadow: showStoredTexts ? '0 2px 8px rgba(88, 86, 214, 0.3)' : '0 2px 8px rgba(255, 59, 48, 0.3)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = showStoredTexts ? '#4a4a9e' : '#d70015';
              e.currentTarget.style.boxShadow = showStoredTexts ? '0 4px 12px rgba(88, 86, 214, 0.4)' : '0 4px 12px rgba(255, 59, 48, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = showStoredTexts ? '#5856d6' : '#ff3b30';
              e.currentTarget.style.boxShadow = showStoredTexts ? '0 2px 8px rgba(88, 86, 214, 0.3)' : '0 2px 8px rgba(255, 59, 48, 0.3)';
            }}
          >
            {showStoredTexts ? 'Hide' : 'View'}
                </button>
        </div>

        {/* Stored Texts Display */}
        {showStoredTexts && (
          <div style={{
            width: '100%',
            maxWidth: 900,
            marginTop: isMobile ? '8px' : '12px',
            marginRight: 'auto',
            marginBottom: isMobile ? '8px' : '12px',
            marginLeft: 'auto',
            padding: isMobile ? '12px' : '16px',
            background: 'rgba(88, 86, 214, 0.15)',
            borderRadius: isMobile ? '12px' : '16px',
            border: '1px solid rgba(88, 86, 214, 0.3)',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: isMobile ? '12px' : '14px',
                color: '#5856d6',
                fontWeight: '600'
              }}>
                <span>📝</span>
                <span>Stored Texts ({Object.values(storedTexts).flat().length})</span>
              </div>
              {Object.keys(storedTexts).length > 0 && (
                <button
                  onClick={handleClearAllStoredTexts}
                  style={{
                    background: '#ff3b30',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: isMobile ? '10px' : '12px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#d70015';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#ff3b30';
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
            {Object.keys(storedTexts).length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#ffffff',
                fontSize: isMobile ? '12px' : '14px',
                padding: '20px'
              }}>
                No stored texts yet. Type something and click &quot;Store&quot; to save it.
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {Object.entries(storedTexts).map(([date, texts]) => (
                  <div key={date} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {/* Date Header */}
                    <div style={{
                      fontSize: isMobile ? '14px' : '16px',
                      color: '#2196f3',
                      fontWeight: '600',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(33, 150, 243, 0.3)'
                    }}>
                      {date}
                    </div>
                    {/* Texts for this date */}
                    {texts.map((text, index) => (
                      <div key={`${date}-${index}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'rgba(88, 86, 214, 0.25)',
                        borderRadius: '8px',
                        border: '1px solid rgba(88, 86, 214, 0.4)',
                        marginLeft: '16px'
                      }}>
                        <div style={{
                          flex: 1,
                          fontSize: isMobile ? '12px' : '14px',
                          color: '#ffffff',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          transition: 'background 0.2s'
                        }}
                        onClick={() => handleLoadStoredText(text)}
                        onMouseOver={e => {
                          e.currentTarget.style.background = 'rgba(88, 86, 214, 0.3)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        >
                          {text}
                        </div>
                        <button
                          onClick={() => handleDeleteStoredText(date, index)}
                          style={{
                            background: '#ff3b30',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: isMobile ? '10px' : '12px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = '#d70015';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = '#ff3b30';
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
            </div>
          ))}
              </div>
            )}
          </div>
        )}

        {/* Keyboard Section */}
        {!showStoredTexts && (
          <div className="keyboard-container" style={{
            width: '100%', 
            minHeight: isMobile ? '350px' : '450px',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 0,
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0,
            paddingBottom: isMobile ? '8px' : '24px',
            position: 'relative',
            zIndex: 2,
            flexShrink: 0
          }}>
          <Keyboard
            keyboardRef={r => (keyboardRef.current = r)}
            theme={"hg-theme-default hg-layout-default myTheme"}
            onKeyPress={onKeyPress}
            physicalKeyboardHighlight={true}
            layoutName={isNumberMode ? "numbers" : (isLettersOnly ? (caps ? (checked ? "QWERTY_letters" : "ABCD_letters") : (checked ? "qwerty_letters" : "abcd_letters")) : (caps ? (checked ? "QWERTY" : "ABCD") : (checked ? "qwerty" : "abcd")))}
            display= {{
            '{bksp}': isMobile ? '' : 'BACKSPACE',
            '{enter}': isMobile ? '' : 'ENTER',
            '{lock}': isMobile ? '' : 'CAPS',
            '{space}': 'SPACE',
            '{abc}': 'ABC',
            '{123}': '123',
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷',
            '%': '%',
            '^': '^',
            '(': '(',
            ')': ')',
            '=': '=',
            '.': '.',
            ',': ',',
            '?': '?',
            "'": "'"}}
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
              ],
              qwerty_letters: [
                "q w e r t y u i o p {bksp}",
                "{lock} a s d f g h j k l ' {enter}",
                "z x c v b n m , . ?",
                "{space}"
              ],
              QWERTY_letters: [
                "Q W E R T Y U I O P {bksp}",
                "{lock} A S D F G H J K L ' {enter}",
                "Z X C V B N M , . ?",
                "{space}"
              ],
              abcd_letters: [
                "a b c d e f g h i {bksp}",
                "{lock} j k l m n o p q r s ' {enter}",
                "t u v w x y z , . ?",
                "{space}"
              ],
              ABCD_letters: [
                "A B C D E F G H I {bksp}",
                "{lock} J K L M N O P Q R S ' {enter}",
                "T U V W X Y Z , . ?",
                "{space}"
              ],
              numbers: [
                "1 2 3 + -",
                "4 5 6 * /",
                "7 8 9 % ^",
                ". 0 ( ) =",
                "{abc} {space} {enter} {bksp}"
              ]
            }}
            style={{
              width: '100%',
              '--hg-button-size': getButtonSize(),
              '--hg-button-gap': '2px',
              '--hg-button-margin': '1px',
              '--hg-button-padding': '0px',
              '--hg-button-border-radius': isMobile ? '16px' : '24px',
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
        )}
      </div>
    </>
  );
} 
