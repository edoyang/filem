import tmdbApi from "../config/tmdb";

// Fetch popular movies
export const fetchPopularMovies = async () => {
  const response = await tmdbApi.get("/movie/popular");
  return response.data.results.map((movie) => movie.id);
};

// Fetch upcoming movies
export const fetchUpcomingMovies = async () => {
  const response = await tmdbApi.get("/movie/upcoming");
  return response.data.results.map((movie) => movie.id);
};

// Fetch now playing movies
export const fetchNowPlayingMovies = async () => {
  const response = await tmdbApi.get("/movie/now_playing");
  return response.data.results.map((movie) => movie.id);
};

// Fetch recently added movies
export const fetchRecentlyAddedMovies = async () => {
  const response = await tmdbApi.get("/discover/movie", {
    params: {
      sort_by: "release_date.desc",
      release_date_lte: new Date().toISOString().split("T")[0],
    },
  });

  return response.data.results.map((movie) => movie.id);
};

// Fetch movie details, credits, and providers
export const fetchMovieDetails = async (id) => {
  const [details, credits, providers] = await Promise.all([
    tmdbApi.get(`/movie/${id}`),
    tmdbApi.get(`/movie/${id}/credits`),
    tmdbApi.get(`/movie/${id}/watch/providers`),
  ]);

  const director = credits.data.crew.find(
    (person) => person.job === "Director"
  );
  const cast = credits.data.cast.slice(0, 5).map((actor) => actor.name);
  const providerLogos = (providers.data.results?.AU?.flatrate || [])
    .map(
      (provider) =>
        `<img 
          src="https://image.tmdb.org/t/p/original${provider.logo_path}" 
          alt="${provider.provider_name}" 
          class="provider-logo" 
        />`
    )
    .join("");

  return {
    id,
    title: details.data.title,
    genres:
      details.data.genres
        .slice(0, 2)
        .map((g) => g.name)
        .join(", ") || "Unknown",
    year: details.data.release_date.split("-")[0],
    duration: `${Math.floor(details.data.runtime / 60)}h ${
      details.data.runtime % 60
    }m`,
    overview: details.data.overview,
    director: director ? director.name : "Unknown",
    cast: cast.length > 0 ? cast.join(", ") : "No cast available",
    watchProviders: providerLogos || "No providers available",
    backdropPath: details.data.backdrop_path,
    posterPath: details.data.poster_path,
  };
};

const GENRE_IDS = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Fantasy: 14,
  Horror: 27,
  Romance: 10749,
  ScienceFiction: 878,
  Thriller: 53,
  War: 10752,
};

// Fetch movies by genre ID
const fetchMoviesByGenre = async (genreId) => {
  const response = await tmdbApi.get("/discover/movie", {
    params: { with_genres: genreId },
  });
  return response.data.results.map((movie) => movie.id);
};

// Group genre fetchers into an object
export const genres = {
  Action: () => fetchMoviesByGenre(GENRE_IDS.Action),
  Adventure: () => fetchMoviesByGenre(GENRE_IDS.Adventure),
  Animation: () => fetchMoviesByGenre(GENRE_IDS.Animation),
  Comedy: () => fetchMoviesByGenre(GENRE_IDS.Comedy),
  Crime: () => fetchMoviesByGenre(GENRE_IDS.Crime),
  Documentary: () => fetchMoviesByGenre(GENRE_IDS.Documentary),
  Drama: () => fetchMoviesByGenre(GENRE_IDS.Drama),
  Fantasy: () => fetchMoviesByGenre(GENRE_IDS.Fantasy),
  Horror: () => fetchMoviesByGenre(GENRE_IDS.Horror),
  Romance: () => fetchMoviesByGenre(GENRE_IDS.Romance),
  ScienceFiction: () => fetchMoviesByGenre(GENRE_IDS.ScienceFiction),
  Thriller: () => fetchMoviesByGenre(GENRE_IDS.Thriller),
  War: () => fetchMoviesByGenre(GENRE_IDS.War),
  RecentlyAdded: fetchRecentlyAddedMovies,
};
