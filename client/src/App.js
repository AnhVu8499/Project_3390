import React, { useState } from 'react';
import './App.css';
import InputService from './InputService';
import ServiceList from './ServiceList';
import Header from './Header';
import Admin from './Admin';
import Verification from './Verification';

const App = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showVerification, setShowVerification] = useState(true); // Initially show verification form

  const handleAdminButtonClick = () => {
    setShowVerification(true); // Show verification form
  };

  return (
    <div>
      <Header />
      <ServiceList />
      <button onClick={handleAdminButtonClick}>
        {showAdmin ? 'Hide Admin' : 'Show Admin'}
      </button>
      {showVerification ? <Verification onVerified={() => setShowAdmin(true)} /> : null}
      {showAdmin && !showVerification && <Admin />}
    </div>
  );
};

export default App;
