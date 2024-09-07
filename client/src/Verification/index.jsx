import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Verification = ({ onVerified, handleGoBack }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const isCodeSent = useRef(false); // Ref to track if the code has been sent

  // Function to request the verification code via email
  const sendVerificationCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/admin/send-admin-verification');
      if (response.status === 200) {
        setMessage('Verification code sent to your email');
      }
    } catch (error) {
      setError('Failed to send verification code');
    }
  };

  // Automatically send verification code when the component mounts
  useEffect(() => {
    if (!isCodeSent.current) { // Check if the code has already been sent
      sendVerificationCode();
      isCodeSent.current = true; // Mark as sent
    }
  }, []); // Empty dependency array to run only on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/admin/verify-admin-code', { code });
      if (response.status === 200) {
        onVerified();
      }
    } catch (error) {
      setError('Invalid verification code');
    }
  };

  return (
    <div>
      <h2>Enter Verification Code</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          required
        />
        <button type="submit">Verify</button>
      </form>
      <button onClick={ handleGoBack }>Go Back</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Verification;
