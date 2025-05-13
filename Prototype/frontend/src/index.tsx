import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AutoGenerate from './pages/AutoGenerate';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/autogenerate" element={<AutoGenerate />} />
        {}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
