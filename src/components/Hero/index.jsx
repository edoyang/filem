import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { fetchPopularMovies, fetchMovieDetails } from "../../utils/apiHelper";
import MovieCard from "../MovieCard";
import { useNavigate } from "react-router";
import "./style.scss";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isClickAllowed, setIsClickAllowed] = useState(true);
  const navigate = useNavigate();

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
        const movieIds = await fetchPopularMovies();
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

  const handleMouseDown = (event) => {
    setStartPos({ x: event.clientX, y: event.clientY });
    setIsClickAllowed(true); // Reset click allowance
  };

  const handleMouseMove = (event) => {
    const moveX = Math.abs(event.clientX - startPos.x);
    const moveY = Math.abs(event.clientY - startPos.y);
    if (moveX > 10 || moveY > 10) {
      setIsClickAllowed(false); // Disallow click if movement exceeds threshold
    }
  };

  const handleMouseUp = (event, id) => {
    if (isClickAllowed) {
      navigate(`/movie/${id}`); // Navigate to the movie page
    }
  };

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
                onMouseUp={(event) => handleMouseUp(event, movie.id)}>
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
