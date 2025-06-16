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

export const OptionsRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  margin: 8px 0;
`;

export const OptionButton = styled(Button)`
  width: 100%;
  margin: 0;
  font-size: 1.1rem;
`;

export const ErrorMsg = styled.div`
  color: #fff;
  background: #e53935;
  border-radius: 6px;
  padding: 10px 16px;
  margin: 12px 0;
  width: 100%;
  text-align: center;
  font-weight: 500;
`; 