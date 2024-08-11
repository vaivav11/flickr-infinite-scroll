import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Gallery from './components/Gallery/Gallery';
import Favorites from './components/Favorites/Favorites';
import './App.css';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Search: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  React.useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <input
      type="text"
      placeholder="Search by title..."
      value={query}
      onChange={handleChange}
      className="search-input"
    />
  );
};

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
        <Search onSearch={handleSearch} />
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
