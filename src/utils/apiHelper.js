import tmdbApi from "../config/tmdb";

export const fetchPopularMovies = async () => {
  const response = await tmdbApi.get("/movie/popular");
  return response.data.results.map((movie) => movie.id);
};

export const fetchUpcomingMovies = async () => {
  const response = await tmdbApi.get("/movie/upcoming");
  return response.data.results.map((movie) => movie.id);
};

export const fetchNowPlayingMovies = async () => {
  const response = await tmdbApi.get("/movie/now_playing");
  return response.data.results.map((movie) => movie.id);
};

// Fetch movie details, credits, providers and transform them
export const fetchMovieDetails = async (id) => {
  const [details, credits, providers] = await Promise.all([
    tmdbApi.get(`/movie/${id}`),
    tmdbApi.get(`/movie/${id}/credits`),
    tmdbApi.get(`/movie/${id}/watch/providers`),
  ]);

  // Combine and transform data
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
    id: id,
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

export const Action = async () => fetchMoviesByGenre(GENRE_IDS.Action);
export const Adventure = async () => fetchMoviesByGenre(GENRE_IDS.Adventure);
export const Animation = async () => fetchMoviesByGenre(GENRE_IDS.Animation);
export const Comedy = async () => fetchMoviesByGenre(GENRE_IDS.Comedy);
export const Crime = async () => fetchMoviesByGenre(GENRE_IDS.Crime);
export const Documentary = async () =>
  fetchMoviesByGenre(GENRE_IDS.Documentary);
export const Drama = async () => fetchMoviesByGenre(GENRE_IDS.Drama);
export const Fantasy = async () => fetchMoviesByGenre(GENRE_IDS.Fantasy);
export const Horror = async () => fetchMoviesByGenre(GENRE_IDS.Horror);
export const Romance = async () => fetchMoviesByGenre(GENRE_IDS.Romance);
export const Science = async () => fetchMoviesByGenre(GENRE_IDS.ScienceFiction);
export const Thriller = async () => fetchMoviesByGenre(GENRE_IDS.Thriller);
export const War = async () => fetchMoviesByGenre(GENRE_IDS.War);
