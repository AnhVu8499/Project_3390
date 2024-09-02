import React, { useState } from 'react';
import axios from 'axios';

const Verification = ({ onVerified }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/admin/verify-admin-code', { code });
      if (response.status === 200) {
        onVerified(); // Notify parent component to show Admin
      }
    } catch (error) {
      setError('Invalid verification code');
    }
  };

  return (
    <div>
      <h2>Enter Verification Code</h2>
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
      {error && <p>{error}</p>}
    </div>
  );
};

export default Verification;
