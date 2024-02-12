// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import your CSS file

const API_KEY = '7c209b04';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const response = await axios.get(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`);
          setSearchResults(response.data.Search || []);
          setError(null);
        } catch (error) {
          console.error('Error fetching data:', error.message);
          setError('Error fetching data. Please try again.');
        }
      }
    };

    fetchData();
  }, [searchQuery]);

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
      setSelectedMovie(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching movie details:', error.message);
      setError('Error fetching movie details. Please try again.');
    }
  };

  const addToFavorites = () => {
    if (selectedMovie && !favorites.some((fav) => fav.imdbID === selectedMovie.imdbID)) {
      setFavorites([...favorites, selectedMovie]);
    }
  };

  return (
    <div className="app-container">
      <h1>♡.........Movies Zone........♡</h1>

      <input
        type="text"
        placeholder="Search for movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="search-results">
        {searchResults.map((movie) => (
          <div key={movie.imdbID} className="movie-item" onClick={() => fetchMovieDetails(movie.imdbID)}>
            <img src={movie.Poster} alt={movie.Title} />
            <p>{movie.Title} ({movie.Year})</p>
          </div>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}

      {selectedMovie && (
        <div className="movie-details">
          <h2>{selectedMovie.Title}</h2>
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
          <p>Plot: {selectedMovie.Plot}</p>
          <p>Genre: {selectedMovie.Genre}</p>
          <p>Runtime: {selectedMovie.Runtime}</p>
          <p>Rating: {selectedMovie.imdbRating}</p>
          <button onClick={addToFavorites}>Add to Favorites</button>
        </div>
      )}

      <div className="favorites-list">
        <h2>Favorites</h2>
        <ul>
          {favorites.map((fav) => (
            <li key={fav.imdbID}>
              {fav.Title} ({fav.Year})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
