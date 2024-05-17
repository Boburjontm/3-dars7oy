import React, { useState, useEffect } from 'react';
import ScienceIcon from '@mui/icons-material/Science';
import AppsIcon from '@mui/icons-material/Apps';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TextField, IconButton, InputAdornment, Modal, Box, Button } from '@mui/material';
import annyang from 'annyang';
import axios from 'axios';
import Google from '../public/img/Google-Logo.wine.svg';

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID';

const App = () => {
  const [query, setQuery] = useState('');
  const [sites, setSites] = useState([]);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteURL, setNewSiteURL] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (annyang) {
      annyang.addCommands({
        '*term': (term) => {
          setQuery(term);
          handleSearch(term);
        },
      });

      annyang.addCallback('error', (err) => {
        console.error('Annyang error:', err);
      });
    }
  }, []);

  const handleSearch = async (term = query) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
        params: {
          key: GOOGLE_API_KEY,
          cx: SEARCH_ENGINE_ID,
          q: term,
        },
      });
      setSearchResults(response.data.items);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const startListening = () => {
    if (annyang) {
      annyang.start({ autoRestart: false, continuous: false });
    }
  };

  const addSite = () => {
    if (newSiteName.trim() && newSiteURL.trim()) {
      setSites([{ name: newSiteName, url: newSiteURL }, ...sites]);
      setNewSiteName('');
      setNewSiteURL('');
      setModalOpen(false);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-4">
        <div className="headertop flex justify-end">
          <ul className="flex gap-4 cursor-pointer">
            <li>Gmail</li>
            <li>Images</li>
            <li><ScienceIcon /></li>
            <li><AppsIcon /></li>
            <li><AccountCircleIcon /></li>
          </ul>
        </div>
        <div className="headercenter flex flex-col items-center mt-20">
          <img src={Google} alt="Google logo" className="cursor-pointer w-[20%]" />
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                    <IconButton onClick={startListening}>
                      <MicIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div className="mt-4 w-full max-w-md flex flex-wrap gap-4">
              {sites.map((site, index) => (
                <div key={index} className="flex flex-col items-center">
                  <a href={site.url} target="_blank" rel="noopener noreferrer ">
                    <IconButton>
                      <AddCircleIcon fontSize="large" />
                    </IconButton>
                  </a>
                  <span className="text-center">{site.name}</span>
                </div>
              ))}
              <IconButton className='flex flex-col ' onClick={handleOpenModal}>
                <AddCircleIcon fontSize="large" />
              <span className=' text-sm'>Add site</span>

              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 id="modal-modal-title">Add a new site</h2>
          <TextField
            variant="outlined"
            value={newSiteName}
            onChange={(e) => setNewSiteName(e.target.value)}
            placeholder="Enter site name"
            fullWidth
            margin="normal"
          />
          <TextField
            variant="outlined"
            value={newSiteURL}
            onChange={(e) => setNewSiteURL(e.target.value)}
            placeholder="Enter site URL"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={addSite}>
            Add Site
          </Button>
        </Box>
      </Modal>
      <div className="mt-10 mx-auto w-full max-w-2xl">
        {searchResults && searchResults.map((result, index) => (
          <div key={index} className="border-b py-4">
            <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-700">
              <h3 className="text-lg">{result.title}</h3>
              <p>{result.snippet}</p>
              <span>{result.displayLink}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
