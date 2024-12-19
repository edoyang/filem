import "./style.scss";

const MovieCard = ({ movie, currentSlide }) => {
  return (
    <div
      className="movie"
      aria-hidden={!currentSlide}
      tabIndex={currentSlide ? "0" : "-1"}>
      <div className="cover">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
          alt={`${movie.title} cover`}
        />
      </div>
      <div className="movie-footer">
        <h3 className="movie-title">{movie.title}</h3>
        <span className="movie-info">
          <p>{movie.genres}</p> | <p>{movie.year}</p> | <p>{movie.duration}</p>
        </span>
        <p className="movie-overview">{movie.overview}</p>
        <div className="movie-credits">
          <p>
            <strong>Director:</strong> {movie.director}
          </p>
          <p>
            <strong>Cast:</strong> {movie.cast}
          </p>
        </div>
        <div className="where-to-watch">
          <p>
            <strong>Where to Watch:</strong>
          </p>
          <div
            className="provider-logos"
            dangerouslySetInnerHTML={{ __html: movie.watchProviders }}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
