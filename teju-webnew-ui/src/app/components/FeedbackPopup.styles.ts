import styled from "styled-components";

export const FeedbackOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const FeedbackModal = styled.div`
  background: #23242a;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

export const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h3 {
    color: #fff;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 500;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  > div {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    label {
      color: #fff;
      font-weight: 500;
      font-size: 1rem;
    }
  }
`;

export const RatingContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

export const StarButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${({ $active }) => ($active ? "#ffd700" : "#666")};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  
  &:hover {
    color: #ffd700;
  }
`;

export const FeedbackTypeContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const FeedbackTypeButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? "#2196f3" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#ccc")};
  border: 2px solid ${({ $active }) => ($active ? "#2196f3" : "#666")};
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ $active }) => ($active ? "#1976d2" : "rgba(255, 255, 255, 0.1)")};
    border-color: ${({ $active }) => ($active ? "#1976d2" : "#999")};
  }
`;

export const FeedbackTextArea = styled.textarea`
  background: #1a1a1a;
  color: #ccc;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
  
  &::placeholder {
    color: #666;
  }
`;

export const SubmitButton = styled.button`
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover:not(:disabled) {
    background: #16a34a;
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

export const ThankYouMessage = styled.div`
  text-align: center;
  color: #fff;
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 1.3rem;
    color: #22c55e;
  }
  
  p {
    margin: 0;
    color: #ccc;
  }
`; 