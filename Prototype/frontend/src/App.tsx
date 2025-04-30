import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [message, setMessage] = useState<string>();
  useEffect(() => {
    fetch('http://localhost:5000/')
    // When the response is received, parse it as JSON
      .then(response => {
        // ... (error checking) ...
        return response.json(); // Parse the response body as JSON
      })
      .then(data => {
        console.log('Fetch data received:', data);
        setMessage(data); 
      })
  }, [])

  return (
    <div>
      <h1>This is the frontend for now</h1>
      <h2>This will probably be a single page application to avoid using external router packages</h2>
      <h3>{message}</h3>
    </div>
  )
}

export default App;
