import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AIExplanationPage from './AIExplanationPage';
import './App.css';

function AppWithRouter() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AIExplanationPage />} />
          <Route path="/home" element={<App />} />
          <Route path="/ai" element={<AIExplanationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppWithRouter;