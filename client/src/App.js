import React, { useRef, useState } from 'react';
import './App.css';
import ServiceList from './ServiceList';
import Header from './Header';

const App = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const bookingSectionRef = useRef(null);

  const handleVerified = () => {
    setShowVerification(false);
    setShowAdmin(true);
  };

  const handleGoBack = () => {
    setShowVerification(false);
    setShowAdmin(false);
  };

  return (
    <div> 
      {/* <Header bookingSectionRef={bookingSectionRef} />
      <ServiceList bookingSectionRef={bookingSectionRef} /> */}
      {!showAdmin && !showVerification && (
        <Header bookingSectionRef={bookingSectionRef} />
      )}

      <ServiceList
        bookingSectionRef={bookingSectionRef}
        showAdmin={showAdmin}
        showVerification={showVerification}
        setShowVerification={setShowVerification}
        handleVerified={handleVerified}
        handleGoBack={handleGoBack}
      />
    </div>
  );
};

export default App;
