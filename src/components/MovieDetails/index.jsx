import "./style.scss";

const MovieDetails = ({
  backdropPath,
  title,
  year,
  duration,
  genres,
  director,
  cast,
  overview,
  watchProviders,
}) => {
  return (
    <div className="movie-details">
      <div className="image-container">
        <img
          src={`https://image.tmdb.org/t/p/original${backdropPath}`}
          alt={title}
        />
      </div>
      <div className="movie">
        <h1>{title}</h1>
        <div className="movie-info">
          <p>{year}</p>
          <p>{duration}</p>
          <p>{genres}</p>
        </div>
        <p className="overview">{overview}</p>
        <p className="cast">
          <strong>Starring:</strong> {cast}
        </p>
        <p className="director">Director: {director}</p>
        {watchProviders !== "No providers available" && (
          <div className="where-to-watch">
            <p>
              <strong>Where to Watch:</strong>
            </p>
            <div
              className="provider-logos"
              dangerouslySetInnerHTML={{ __html: watchProviders }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
