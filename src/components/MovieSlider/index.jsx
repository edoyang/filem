import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Card from "../Card";
import genreFetchers from "../../utils/genreFetchers";
import {
  fetchMovieDetails,
  fetchRecentlyAddedMovies,
} from "../../utils/apiHelper";
import "./index.scss";

const MovieSlider = ({ genre = fetchRecentlyAddedMovies }) => {
  const [movies, setMovies] = useState([]);
  const sliderRef = useRef(null);

  // Find the title dynamically based on the genre function
  const genreTitle =
    Object.keys(genreFetchers).find((key) => genreFetchers[key] === genre) ||
    "Recently Added";

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    swipeToSlide: true,
    variableWidth: true,
    afterChange: (current) => {
      const slides = sliderRef.current.querySelectorAll(".slick-slide");
      slides.forEach((slide, index) => {
        if (index === current) {
          slide.setAttribute("aria-hidden", "false");
          slide.tabIndex = 0;
          slide.focus();
        } else {
          slide.setAttribute("aria-hidden", "true");
          slide.tabIndex = -1;
        }
      });
    },
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const fetchMovies = genre; // Use the genre function directly
        if (!fetchMovies) {
          console.error(`No fetcher found for genre`);
          return;
        }

        const movieIds = await fetchMovies();

        const movieDataPromises = movieIds.map(async (id) => {
          const details = await fetchMovieDetails(id);
          return {
            id,
            src: `https://image.tmdb.org/t/p/original/${details.posterPath}`,
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
          <Card key={movie.id} src={movie.src} alt={movie.alt} />
        ))}
      </Slider>
    </div>
  );
};

export default MovieSlider;
