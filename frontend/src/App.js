import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArtworkListPage from './pages/ArtworkListPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import StyleTransferPage from './pages/StyleTransferPage';
import ArtworkStyleTransferPage from './pages/ArtworkStyleTransferPage';
import AIExplanationPage from './pages/AIExplanationPage';
import JourneyMapPage from './pages/JourneyMapPage';
import RelationshipPage from './pages/RelationshipPage';
import TimelinePage from './pages/TimelinePage'
import BackgroundSlideshow from './components/BackgroundSlideshow';
import './App.css';

function AppShell() {
  const location = useLocation();

  const bgImages =
    location.pathname === '/'
      ? ['/images/bg1.jpg', '/images/bg2.jpg']
      : ['/images/list_bg1.jpg', '/images/list_bg2.jpg'];

  return (
    <div className="app-shell">
      <BackgroundSlideshow images={bgImages} intervalMs={5000} fadeMs={1200} />
      <div className="app-content">
        <div className="route-fade" key={location.key}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artworks" element={<ArtworkListPage />} />
            <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
            <Route path="/artwork/:id/style-transfer" element={<ArtworkStyleTransferPage />} />
            <Route path="/style-transfer" element={<StyleTransferPage />} />
            <Route path="/ai-explanation" element={<AIExplanationPage />} />
            <Route path="/journey-map" element={<JourneyMapPage />} />
            <Route path="/relationships" element={<RelationshipPage />} />
            <Route path="/timeline" element={<TimelinePage/>}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
