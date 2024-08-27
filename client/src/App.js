import React from 'react';
import './App.css';
import InputService from './InputService';
import ServiceList from './ServiceList';
import Header from './Header';

function App() {
  return (
    <div>
      {/* <InputService/> */}
      <Header/>
      <ServiceList/>
    </div>
  )
}

export default App;
