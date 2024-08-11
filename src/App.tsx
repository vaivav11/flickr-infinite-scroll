import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Gallery from './components/Gallery/Gallery';
import Favorites from './components/Favorites/Favorites';
import Search from './components/Search/Search';
import './App.css';

const AppContent: React.FC<{ searchQuery: string; setSearchQuery: React.Dispatch<React.SetStateAction<string>> }> = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleHomeClick = () => {
    setSearchQuery(''); 
    navigate('/'); 
  };

  return (
    <div>
      <nav>
        <Link to="/" onClick={handleHomeClick}>Home</Link>
        <Link to="/favorites">Favorites</Link>
        <Search onSearch={handleSearch} query={searchQuery} />
      </nav>
      <Routes>
        <Route path="/" element={<Gallery searchQuery={searchQuery} />} />
        <Route path="/favorites" element={<Favorites searchQuery={searchQuery} />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <AppContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </Router>
  );
};

export default App;
