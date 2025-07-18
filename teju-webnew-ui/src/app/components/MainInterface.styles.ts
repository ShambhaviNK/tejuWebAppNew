import styled from "styled-components";

export const Container = styled.div`
  background: #23242a;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.4);
  margin: 40px auto;
  padding: 32px 24px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h2`
  color: #fff;
  margin-bottom: 24px;
  font-weight: 400;
`;

export const Button = styled.button<{ $green?: boolean; $red?: boolean }>`
  background: ${({ $green, $red }) =>
    $red ? "#e53935" : $green ? "#22c55e" : "#2196f3"};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  margin: 12px 0;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
  &:hover {
    background: ${({ $green, $red }) =>
      $red ? "#b71c1c" : $green ? "#16a34a" : "#1976d2"};
  }
`;

export const SmallButton = styled.button<{ $green?: boolean; $red?: boolean }>`
  background: ${({ $green, $red }) =>
    $red ? "#e53935" : $green ? "#22c55e" : "#2196f3"};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
  &:hover {
    background: ${({ $green, $red }) =>
      $red ? "#b71c1c" : $green ? "#16a34a" : "#1976d2"};
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  margin: 0;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  margin: 12px 0;
`;

export const TextArea = styled.textarea`
  background: #23242a;
  color: #ccc;
  border: 2px solid #333;
  border-radius: 8px;
  width: 100%;
  min-height: 60px;
  margin: 12px 0;
  padding: 12px;
  font-size: 1rem;
  resize: none;
`;

export const ContextTextArea = styled.textarea`
  background: #23242a;
  color: #ccc;
  border: 2px solid #333;
  border-radius: 8px;
  width: 100%;
  min-height: 100px;
  margin: 12px 0;
  padding: 18px 50px 18px 16px;
  font-size: 0.9rem;
  resize: vertical;
`;

export const ContextTextAreaContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 12px 0;
`;

export const ContextMicIcon = styled.button<{ $recognizing?: boolean; $right?: number }>`
  position: absolute;
  right: ${({ $right }) => ($right !== undefined ? `${$right}px` : '12px')};
  top: 50%;
  transform: translateY(-50%);
  background: ${({ $recognizing }) => $recognizing ? "#e53935" : "#22c55e"};
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ $recognizing }) => $recognizing ? "#b71c1c" : "#16a34a"};
  }
`;

export const ContextLabel = styled.label`
  color: #ccc;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
  text-align: left;
  width: 100%;
`;

export const TextAreaContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 12px 0;
`;

export const TextAreaWithIcon = styled.textarea`
  background: #23242a;
  color: #ccc;
  border: 2px solid #333;
  border-radius: 8px;
  width: 100%;
  min-height: 60px;
  padding: 12px 90px 12px 12px;
  font-size: 1rem;
  resize: none;
`;

export const MicIcon = styled.button<{ $recognizing?: boolean }>`
  position: absolute;
  right: 56px;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ $recognizing }) => $recognizing ? "#e53935" : "#22c55e"};
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ $recognizing }) => $recognizing ? "#b71c1c" : "#16a34a"};
  }
`;

export const SpeakerIcon = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1976d2;
  }
`;

export const OptionsRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  margin: 0;
`;

export const CenteredOptionsRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0;
`;

export const OptionButton = styled(Button)<{$clicked?: boolean;}>`
  width: calc(50% - 8px);
  margin: 0;
  font-size: 1.1rem;
  padding: 50px;
  background: ${({$clicked}) =>
    $clicked ? "#b71c1c" : "#16a34a"};
  &:hover {
    background: ${({ $clicked }) =>
      $clicked ? "#8b1a1a" : "#128c3c"};
  }
`;

export const ErrorMsg = styled.div`
  color: #fff;
  background: #e53935;
  border-radius: 6px;
  padding: 10px 16px;
  margin: 0;
  width: 100%;
  text-align: center;
  font-weight: 500;
`;

export const ContextClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #e53935;
  color: #111;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  outline: none;
  padding: 0;
`;

export const HelpLink = styled.a`
  color: #2196f3;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 20px;
  display: block;
  text-align: center;
  transition: color 0.2s;
  &:hover {
    color: #1976d2;
    text-decoration: underline;
  }
`;

export const FloatingFeedbackButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 30px;
  min-width: 120px;
  height: 48px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.3);
  transition: all 0.2s;
  z-index: 100;
  
  &:hover {
    background: #1976d2;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;