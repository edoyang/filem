import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchMovieDetails } from "../../utils/apiHelper";
import MovieDetails from "../../components/MovieDetails";

const Movie = () => {
  const { id } = useParams(); // Extract the movie ID from the URL
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const details = await fetchMovieDetails(id);
        setMovie(details);
      } catch (error) {
        console.error(`Failed to fetch movie details for ID ${id}:`, error);
      }
    };

    loadMovie();
  }, [id]);

  if (!movie) {
    return <p>Loading movie details...</p>; // change to a loading spinner later
  }

  return (
    <div className="details">
      <MovieDetails {...movie} />
    </div>
  );
};

export default Movie;
