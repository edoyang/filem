import React, { useState, useEffect } from "react";
import tmdbApi from "../../config/tmdb";
import "./hero.scss";
import Slider from "react-slick";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const topRatedMovies = movies
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 5);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
  };

  useEffect(() => {
    tmdbApi
      .get("/movie/popular")
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div className="hero">
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="slider-container">
          <Slider {...settings}>
            {topRatedMovies.map((movie, index) => (
              <div
                className="movie"
                key={movie.id}
                aria-hidden={index !== currentSlide}
                tabIndex={index === currentSlide ? "0" : "-1"}>
                <img
                  src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                  alt={`${movie.title} cover`}
                  className="cover"
                />
                <div className="movie-footer">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                    className="poster"
                  />
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default Hero;
