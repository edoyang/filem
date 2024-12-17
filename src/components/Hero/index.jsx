import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { fetchPopularMovies, fetchMovieDetails } from "../../utils/apiHelper";
import MovieCard from "../MovieCard";
import "./hero.scss";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        // Fetch popular movie IDs
        const movieIds = await fetchPopularMovies();

        // Fetch and transform movie details
        const movieDetailsPromises = movieIds.map(fetchMovieDetails);
        const fullMovieData = await Promise.all(movieDetailsPromises);

        setMovies(fullMovieData);
        // AUSTRALIA ONLY
        // const filteredMovies = fullMovieData.filter(
        //   (data) => data.watchProviders.length > 0
        // );
        // setMovies(filteredMovies);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError(err.message);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="hero">
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="slider-container">
          <Slider {...settings}>
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                currentSlide={index === currentSlide}
              />
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default Hero;
