import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Card from "../Card";
import { fetchMovieDetails, fetchUpcomingMovies } from "../../utils/apiHelper";
import { useNavigate } from "react-router";
import useNavigateLink from "../../utils/navigateLink";
import "./style.scss";

const MovieSlider = ({ genre = fetchUpcomingMovies, priority = 0, title }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useNavigateLink();

  // Determine genre title - either use passed title or try to find it in the genres object
  const genreTitle = title || "Movies";

  const settings = {
    className: "slider variable-width",
    dots: false,
    arrows: false,
    infinite: true,
    variableWidth: true,
    slidesToShow: 1,
    swipeToSlide: true,
    afterChange: (index) => setCurrentSlide(index),
  };

  useEffect(() => {
    let isMounted = true; // for cleanup
    const startDelay = priority * 400; // Stagger loading based on priority

    const loadMovies = async () => {
      // Skip if component unmounted
      if (!isMounted) return;

      setLoading(true);

      try {
        // Apply start delay for prioritization
        if (startDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, startDelay));
        }

        // Skip if component unmounted after delay
        if (!isMounted) return;

        // Fetch movie IDs
        const movieIds = await genre();

        // Progressive loading implementation
        const loadedMovies = [];
        const batch = 4; // Load in small batches to show progress quickly

        for (let i = 0; i < movieIds.length; i += batch) {
          // Skip if component unmounted during loading
          if (!isMounted) return;

          const currentBatch = movieIds.slice(i, i + batch);

          // Load this batch of movies concurrently
          const batchPromises = currentBatch.map(async (id) => {
            try {
              const details = await fetchMovieDetails(id);
              return {
                id,
                src: details.posterPath
                  ? `https://image.tmdb.org/t/p/w342${details.posterPath}`
                  : "/placeholder-poster.jpg",
                alt: details.title || "Movie poster",
                title: details.title,
              };
            } catch (err) {
              console.warn(`Error loading movie ${id}:`, err);
              return null; // Skip failed movies
            }
          });

          const batchResults = await Promise.all(batchPromises);

          // Add successful results to our movies array
          batchResults.forEach((movie) => {
            if (movie) loadedMovies.push(movie);
          });

          // Update state with what we have so far (progressive loading)
          if (isMounted && loadedMovies.length > 0) {
            setMovies([...loadedMovies]);
          }
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error(`Error loading ${genreTitle}:`, error);
        if (isMounted) {
          setError(`Failed to load ${genreTitle}`);
          setLoading(false);
        }
      }
    };

    loadMovies();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [genre, genreTitle, priority]);

  // If completely failed to load and no movies available
  if (error && movies.length === 0) {
    return (
      <div className="movies-slider error">
        <h1>{genreTitle}</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="movies-slider" ref={sliderRef}>
      <h1>{genreTitle}</h1>

      {/* Show loading placeholders if no movies loaded yet */}
      {movies.length === 0 ? (
        <div className="skeleton-slider">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton-card"></div>
          ))}
        </div>
      ) : (
        <Slider {...settings}>
          {movies.map((movie) => (
            <div
              className="card-wrapper"
              key={movie.id}
              draggable="false"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={(event) => handleMouseUp(navigate, movie.id)}>
              <Card src={movie.src} alt={movie.alt} />
            </div>
          ))}

          {/* Show loading indicator if still loading more */}
          {loading && (
            <div className="card-wrapper loading">
              <div className="loading-card"></div>
            </div>
          )}
        </Slider>
      )}
    </div>
  );
};

export default MovieSlider;
