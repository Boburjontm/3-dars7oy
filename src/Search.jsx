// src/Search.js
import React, { useState } from 'react';
import { TextField, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MicIcon from '@material-ui/icons/Mic';
import annyang from 'annyang';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const startListening = () => {
    if (annyang) {
      annyang.start({ autoRestart: false, continuous: false });

      annyang.addCommands({
        '*term': (term) => {
          setQuery(term);
          handleSearch();
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 w-full">
      <TextField
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
        placeholder="Search Google"
        className="w-full max-w-md"
      />
      <div className="flex mt-4">
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <IconButton onClick={startListening}>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Search;
