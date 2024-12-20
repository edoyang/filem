import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Card from "../Card";
import genreFetchers from "../../utils/genreFetchers";
import { fetchMovieDetails, fetchUpcomingMovies } from "../../utils/apiHelper";
import { useNavigate } from "react-router";
import useNavigateLink from "../../utils/navigateLink"; // Import reusable hook
import "./style.scss";

const MovieSlider = ({ genre = fetchUpcomingMovies }) => {
  const [movies, setMovies] = useState([]);
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // Use navigate for navigation
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useNavigateLink(); // Use hook

  const genreTitle =
    Object.keys(genreFetchers).find((key) => genreFetchers[key] === genre) ||
    "Upcoming Movies";

  const settings = {
    className: "slider variable-width",
    dots: false,
    arrows: false,
    infinite: true,
    variableWidth: true, // Enable variableWidth
    slidesToShow: 1, // Let variableWidth determine visible slides
    swipeToSlide: true,
    afterChange: (index) => setCurrentSlide(index),
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const fetchMovies = genre;
        if (!fetchMovies) {
          console.error(`No fetcher found for genre`);
          return;
        }

        const movieIds = await fetchMovies();

        const movieDataPromises = movieIds.map(async (id) => {
          const details = await fetchMovieDetails(id);
          return {
            id,
            src: `https://image.tmdb.org/t/p/w342/${details.posterPath}`,
            alt: details.title,
          };
        });

        const movieData = await Promise.all(movieDataPromises);
        setMovies(movieData);
      } catch (error) {
        console.error(`Error loading ${genreTitle}:`, error);
      }
    };

    loadMovies();
  }, [genre, genreTitle]);

  return (
    <div className="movies-slider" ref={sliderRef}>
      <h1>{genreTitle}</h1>
      <Slider {...settings}>
        {movies.map((movie) => (
          <div
            className="card-wrapper"
            key={movie.id}
            draggable="false"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={(event) => handleMouseUp(navigate, movie.id)} // Navigate on click
          >
            <Card src={movie.src} alt={movie.alt} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MovieSlider;
