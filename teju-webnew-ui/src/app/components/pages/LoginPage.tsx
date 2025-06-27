"use client"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginBox, Container, Title, Button, InputArea, ContextTextArea, ContextTextAreaContainer, ContextMicIcon, TextAreaContainer, TextAreaWithIcon, MicIcon, SpeakerIcon, OptionsRow, OptionButton, ErrorMsg, TextArea } from "../MainInterface.styles";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      localStorage.setItem("auth", "true");
      navigate("/main");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
          <div className="header">
          <div className="spacer"></div>
          <Button onClick={()=>navigate("/signup")}>Sign Up</Button>
          </div>
          <Container>
            <InputArea
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Name"
            />
            <InputArea
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <Button onClick={handleLogin}>Login</Button>
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
          </Container>
        </div>
  );
}