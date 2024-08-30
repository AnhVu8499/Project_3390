import React, { useRef } from 'react';
import './App.css';
import InputService from './InputService';
import ServiceList from './ServiceList';
import Header from './Header';
import Admin from './Admin';

function App() {
  const bookingSectionRef = useRef(null);
  return (
    <div>
      {/* <InputService/> */}
      {/* <Header bookingSectionRef={bookingSectionRef}/>
      <ServiceList bookingSectionRef={bookingSectionRef}/> */}
      <Admin/>
    </div>
  )
}

export default App;
