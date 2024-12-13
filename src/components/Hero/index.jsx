import React, { useState, useEffect } from "react";
import tmdbApi from "../../config/tmdb";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    tmdbApi
      .get("/movie/popular") // TMDB endpoint for popular movies
      .then((response) => {
        setMovies(response.data.results); // Store movies in state
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {movies.map((movie) => (
            <div key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                alt={`${movie.title} cover`}
                className="cover"
              />
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className="poster"
              />
              <h3>{movie.title}</h3>
              <p>Rating: {movie.vote_average}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
