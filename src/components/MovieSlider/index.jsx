import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Card from "../Card";
import { fetchMovieDetails, genres } from "../../utils/apiHelper";
import "./index.scss";

const MovieSlider = ({ genre = genres.RecentlyAdded }) => {
  const [movies, setMovies] = useState([]);
  const sliderRef = useRef(null);

  // Dynamically derive the title
  const genreTitle =
    Object.keys(genres).find((key) => genres[key] === genre) ||
    "Recently Added";

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    swipeToSlide: true,
    variableWidth: true,
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const movieIds = await genre();

        const movieDataPromises = movieIds.map(async (id) => {
          const details = await fetchMovieDetails(id);
          return {
            id,
            src: `https://image.tmdb.org/t/p/original${details.posterPath}`,
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
      <h1>{`${genreTitle} Movies`}</h1>
      <Slider {...settings}>
        {movies.map((movie) => (
          <Card key={movie.id} src={movie.src} alt={movie.alt} />
        ))}
      </Slider>
    </div>
  );
};

export default MovieSlider;
