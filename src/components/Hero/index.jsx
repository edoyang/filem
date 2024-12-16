import React, { useState, useEffect } from "react";
import tmdbApi from "../../config/tmdb";
import "./hero.scss";
import Slider from "react-slick";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
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
    tmdbApi
      .get("/movie/popular")
      .then((response) => {
        const moviesData = response.data.results;

        const topMovieIds = moviesData.map((movie) => movie.id);

        Promise.all(
          topMovieIds.map((id) =>
            Promise.all([
              tmdbApi.get(`/movie/${id}`).then((res) => ({
                id,
                details: res.data,
              })),
              tmdbApi.get(`/movie/${id}/credits`).then((res) => ({
                id,
                credits: res.data,
              })),
              tmdbApi.get(`/movie/${id}/watch/providers`).then((res) => ({
                id,
                providers: res.data.results,
              })),
            ])
          )
        )
          .then((results) => {
            const filteredMovies = [];
            const detailsMap = {};

            results.forEach(
              ([detailsResult, creditsResult, providersResult]) => {
                const { id, details } = detailsResult;
                const { credits } = creditsResult;
                const { providers } = providersResult;

                const watchProviders = providers?.AU?.flatrate || [];
                if (watchProviders.length > 0) {
                  filteredMovies.push(details);

                  const director = credits.crew.find(
                    (person) => person.job === "Director"
                  );
                  const cast = credits.cast
                    .slice(0, 5)
                    .map((actor) => actor.name);

                  const providerLogos = watchProviders
                    .map(
                      (provider) =>
                        `<img 
                          src="https://image.tmdb.org/t/p/original${provider.logo_path}" 
                          alt="${provider.provider_name}" 
                          title="${provider.provider_name}" 
                          class="provider-logo" 
                        />`
                    )
                    .join("");

                  detailsMap[id] = {
                    genres:
                      details.genres
                        .slice(0, 2)
                        .map((genre) => genre.name)
                        .join(", ") || "Unknown",
                    year: details.release_date.split("-")[0],
                    duration: `${Math.floor(details.runtime / 60)}h ${
                      details.runtime % 60
                    }m`,
                    director: director ? director.name : "Unknown",
                    cast:
                      cast.length > 0 ? cast.join(", ") : "No cast available",
                    watchProviders: providerLogos,
                  };
                }
              }
            );
            setMovies(filteredMovies);
            setMovieDetails(detailsMap);
          })
          .catch((detailsError) => {
            console.error("Error fetching movie details:", detailsError);
            setError(detailsError.message);
          });
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
            {movies.map((movie, index) => (
              <div
                className="movie"
                key={movie.id}
                aria-hidden={index !== currentSlide}
                tabIndex={index === currentSlide ? "0" : "-1"}>
                <div className="cover">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={`${movie.title} cover`}
                  />
                </div>
                <div className="movie-footer">
                  <h3 className="movie-title">{movie.title}</h3>
                  <span className="movie-info">
                    <p>{movieDetails[movie.id]?.genres}</p> |{" "}
                    <p>{movieDetails[movie.id]?.year}</p> |{" "}
                    <p>{movieDetails[movie.id]?.duration}</p>
                  </span>
                  <p className="movie-overview">{movie.overview}</p>
                  <div className="movie-credits">
                    <p>
                      <strong>Director:</strong>{" "}
                      {movieDetails[movie.id]?.director}
                    </p>
                    <p>
                      <strong>Cast:</strong> {movieDetails[movie.id]?.cast}
                    </p>
                  </div>
                  <div className="where-to-watch">
                    <p>
                      <strong>Where to Watch:</strong>
                    </p>
                    <div
                      className="provider-logos"
                      dangerouslySetInnerHTML={{
                        __html: movieDetails[movie.id]?.watchProviders,
                      }}
                    />
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
