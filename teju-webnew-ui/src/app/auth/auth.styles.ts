import styled from 'styled-components';

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #23242a 0%, #181920 100%);
  padding: 20px;
`;

export const AuthForm = styled.form`
  background: rgba(34, 36, 44, 0.98);
  border-radius: 20px;
  padding: 44px 32px 32px 32px;
  width: 100%;
  max-width: 410px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.22), 0 1.5px 0 rgba(255,255,255,0.04);
  border: 1.5px solid #292a33;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const AuthTitle = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 18px;
  font-size: 2.1rem;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #aaa;
  font-size: 1rem;
  margin: 10px 0 8px 0;
  width: 100%;
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1.5px solid #292a33;
    margin: 0 10px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px 16px;
  background: #23242a;
  color: #f5f6fa;
  border: 1.5px solid #292a33;
  border-radius: 8px;
  font-size: 1.08rem;
  margin-bottom: 8px;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid #2196f3;
    box-shadow: 0 0 0 2px #2196f355;
    background: #23243a;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #2196f3 60%, #21cbf3 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.13rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px 0 rgba(33,150,243,0.08);
  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #1976d2 60%, #21cbf3 100%);
    transform: translateY(-1px) scale(1.01);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

export const AuthToggle = styled.button`
  background: none;
  border: none;
  color: #2196f3;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;
  width: 100%;
  padding: 8px;
  transition: color 0.2s;
  &:hover {
    color: #1976d2;
  }
`;

export const ErrorMessage = styled.div`
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

export const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.13);
  border: 1.5px solid #22c55e;
  color: #22c55e;
  padding: 12px 16px;
  border-radius: 7px;
  margin-bottom: 12px;
  font-size: 1rem;
  text-align: center;
`;

// Responsive design
export const ResponsiveContainer = styled.div`
  @media (max-width: 480px) {
    ${AuthForm} {
      padding: 20px 8px 16px 8px;
      margin: 10px;
    }
    ${AuthTitle} {
      font-size: 1.4rem;
      margin-bottom: 18px;
    }
    ${Input} {
      padding: 12px 10px;
      font-size: 0.97rem;
    }
    ${Button} {
      padding: 13px;
      font-size: 1rem;
    }
  }
`; 