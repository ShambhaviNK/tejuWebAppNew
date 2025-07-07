import styled from "styled-components";

export const Container = styled.div`
  background: rgba(34, 36, 44, 0.98);
  border-radius: 28px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.22), 0 1.5px 0 rgba(255,255,255,0.04);
  margin: 48px auto 32px auto;
  padding: 40px 28px 32px 28px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(6px);
  border: 1.5px solid #292a33;
  @media (max-width: 700px) {
    padding: 18px 4vw 18px 4vw;
    margin: 18px 0 0 0;
    border-radius: 18px;
  }
`;

export const Title = styled.h2`
  color: #fff;
  margin-bottom: 24px;
  font-weight: 700;
  font-size: 1.6rem;
  letter-spacing: -0.5px;
`;

export const MainHeading = styled.h1`
  background: linear-gradient(135deg, #2196f3 0%, #21cbf3 50%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 8px;
  text-align: center;
  letter-spacing: -1px;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  
  @media (max-width: 700px) {
    font-size: 2.2rem;
  }
`;

export const SubHeading = styled.p`
  color: #ccc;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 32px;
  font-weight: 400;
  line-height: 1.4;
  
  @media (max-width: 700px) {
    font-size: 1rem;
    margin-bottom: 24px;
  }
`;

export const Button = styled.button<{ $green?: boolean; $red?: boolean }>`
  background: ${({ $green, $red }) =>
    $red ? "#e53935" : $green ? "#22c55e" : "linear-gradient(90deg, #2196f3 60%, #21cbf3 100%)"};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 28px;
  margin: 12px 0;
  font-size: 1.13rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 2px 8px 0 rgba(33,150,243,0.08);
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  &:hover {
    background: ${({ $green, $red }) =>
      $red ? "#b71c1c" : $green ? "#16a34a" : "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)"};
    transform: translateY(-1px) scale(1.01);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus {
    outline: 2px solid #2196f3;
    outline-offset: 2px;
  }
`;

export const SmallButton = styled(Button)`
  padding: 12px 16px;
  font-size: 1rem;
  margin: 0;
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
  color: #f5f6fa;
  border: 1.5px solid #292a33;
  border-radius: 8px;
  width: 100%;
  min-height: 60px;
  margin: 12px 0;
  padding: 14px;
  font-size: 1.08rem;
  resize: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid #2196f3;
    box-shadow: 0 0 0 2px #2196f355;
    background: #23243a;
  }
`;

export const ContextTextArea = styled.textarea`
  background: #23242a;
  color: #ccc;
  border: 2px solid #333;
  border-radius: 8px;
  width: 100%;
  min-height: 40px;
  margin: 12px 0;
  padding: 12px 50px 12px 12px;
  font-size: 0.9rem;
  resize: none;
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
  font-size: 1.1rem;
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
  color: #f5f6fa;
  border: 1.5px solid #292a33;
  border-radius: 8px;
  width: 100%;
  min-height: 60px;
  padding: 14px 90px 14px 14px;
  font-size: 1.08rem;
  resize: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid #2196f3;
    box-shadow: 0 0 0 2px #2196f355;
    background: #23243a;
  }
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
  font-size: 1.2rem;
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
  font-size: 1.2rem;
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

export const OptionButton = styled(Button)<{$clicked?: boolean;}>`
  width: 100%;
  margin: 0;
  font-size: 1.13rem;
  padding: 44px 0;
  background: ${({$clicked}) =>
    $clicked ? "#b71c1c" : "#16a34a"};
  &:hover {
    background: ${({ $clicked }) =>
      $clicked ? "#8b1a1a" : "#128c3c"};
  }
`;

export const ErrorMsg = styled.div`
  background: rgba(229, 57, 53, 0.13);
  border: 1.5px solid #e53935;
  color: #e53935;
  padding: 12px 16px;
  border-radius: 7px;
  margin-bottom: 12px;
  font-size: 1rem;
  text-align: center;
  animation: shake 0.18s 1;
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    50% { transform: translateX(4px); }
    75% { transform: translateX(-2px); }
    100% { transform: translateX(0); }
  }
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
  transition: background 0.2s;
  &:hover {
    background: #b71c1c;
  }
`;