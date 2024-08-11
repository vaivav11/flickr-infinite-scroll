import React, { useState, useEffect, useCallback } from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
  query: string; 
}

const Search: React.FC<SearchProps> = ({ onSearch, query }) => {
  const [localQuery, setLocalQuery] = useState(query);
  const debouncedQuery = useDebounce(localQuery, 300); 

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  }, []);

  useEffect(() => {
    setLocalQuery(query); 
  }, [query]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <input
      type="text"
      placeholder="Search pictures..."
      value={localQuery}
      onChange={handleChange}
      className="search-input"
    />
  );
};

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

export default Search;
