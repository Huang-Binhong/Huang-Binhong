import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArtworkListPage from './pages/ArtworkListPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import StyleTransferPage from './pages/StyleTransferPage';
import AIExplanationPage from './pages/AIExplanationPage';
import JourneyMapPage from './pages/JourneyMapPage';
import RelationshipPage from './pages/RelationshipPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/artworks" element={<ArtworkListPage />} />
        <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
        <Route path="/style-transfer" element={<StyleTransferPage />} />
        <Route path="/ai-explanation" element={<AIExplanationPage />} />
        <Route path="/journey-map" element={<JourneyMapPage />} />
        <Route path="/relationships" element={<RelationshipPage />} />
      </Routes>
    </Router>
  );
}

export default App;
