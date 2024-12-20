import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { fetchPopularMovies, fetchMovieDetails } from "../../utils/apiHelper";
import MovieCard from "../MovieCard";
import { useNavigate } from "react-router"; // Still required here
import useNavigateLink from "../../utils/navigateLink"; // Import the hook
import "./style.scss";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // Local navigate function
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useNavigateLink();

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 250,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const movieIds = await fetchPopularMovies();
        const movieDetailsPromises = movieIds.map(fetchMovieDetails);
        const fullMovieData = await Promise.all(movieDetailsPromises);
        setMovies(fullMovieData);
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
              <div
                key={movie.id}
                draggable="false"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={(event) => handleMouseUp(navigate, movie.id)}>
                <MovieCard
                  movie={movie}
                  currentSlide={index === currentSlide}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default Hero;
