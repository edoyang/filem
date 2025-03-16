// utils/apiHelper.js
import tmdbApi from "../config/tmdb";

// Simple delay function for rate limiting
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep track of last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 50; // milliseconds between requests

// Rate-limited request function - simpler implementation
const rateLimitedRequest = async (requestFn) => {
  // Ensure minimum time between requests
  const now = Date.now();
  const timeToWait = Math.max(0, lastRequestTime + MIN_REQUEST_INTERVAL - now);

  if (timeToWait > 0) {
    await delay(timeToWait);
  }

  // Update last request time
  lastRequestTime = Date.now();

  try {
    // Make the request
    return await requestFn();
  } catch (error) {
    // Handle rate limiting
    if (error.response && error.response.status === 429) {
      const retryAfter = parseInt(
        error.response.headers["retry-after"] || "1",
        10
      );
      console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);

      // Wait for the retry-after period
      await delay(retryAfter * 1000);

      // Try again (only once to avoid infinite loops)
      return await requestFn();
    }

    throw error; // Re-throw other errors
  }
};

// Fetch popular movies
export const fetchPopularMovies = async () => {
  try {
    const response = await rateLimitedRequest(() =>
      tmdbApi.get("/movie/popular")
    );
    return response.data.results.map((movie) => movie.id);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

// Fetch upcoming movies
export const fetchUpcomingMovies = async () => {
  try {
    const response = await rateLimitedRequest(() =>
      tmdbApi.get("/movie/upcoming")
    );
    return response.data.results.map((movie) => movie.id);
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return [];
  }
};

// Fetch now playing movies
export const fetchNowPlayingMovies = async () => {
  try {
    const response = await rateLimitedRequest(() =>
      tmdbApi.get("/movie/now_playing")
    );
    return response.data.results.map((movie) => movie.id);
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return [];
  }
};

// Fetch movie details with reduced complexity
export const fetchMovieDetails = async (id) => {
  try {
    // Get details first
    const details = await rateLimitedRequest(() => tmdbApi.get(`/movie/${id}`));

    // Then get credits
    const credits = await rateLimitedRequest(() =>
      tmdbApi.get(`/movie/${id}/credits`)
    );

    // Then get providers
    const providers = await rateLimitedRequest(() =>
      tmdbApi.get(`/movie/${id}/watch/providers`)
    );

    const director = credits.data.crew.find(
      (person) => person.job === "Director"
    );

    const cast = credits.data.cast.slice(0, 5).map((actor) => actor.name);

    // Handle missing data more gracefully
    const releaseDate = details.data.release_date || "";
    const year = releaseDate ? releaseDate.split("-")[0] : "Unknown";

    const runtime = details.data.runtime || 0;
    const duration = runtime
      ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
      : "Unknown";

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
      title: details.data.title || "Unknown Title",
      genres:
        details.data.genres
          .slice(0, 2)
          .map((g) => g.name)
          .join(", ") || "Unknown",
      year,
      duration,
      overview: details.data.overview || "No overview available",
      director: director ? director.name : "Unknown",
      cast: cast.length > 0 ? cast.join(", ") : "No cast available",
      watchProviders: providerLogos || "No providers available",
      backdropPath: details.data.backdrop_path,
      posterPath: details.data.poster_path,
    };
  } catch (error) {
    console.error(`Error fetching details for movie ${id}:`, error);
    // Return minimal data to prevent UI crashes
    return {
      id,
      title: "Movie " + id,
      genres: "Unknown",
      year: "Unknown",
      duration: "Unknown",
      overview: "Details temporarily unavailable",
      director: "Unknown",
      cast: "Unknown",
      watchProviders: "",
      backdropPath: null,
      posterPath: null,
    };
  }
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
  try {
    const response = await rateLimitedRequest(() =>
      tmdbApi.get("/discover/movie", {
        params: { with_genres: genreId },
      })
    );
    return response.data.results.map((movie) => movie.id);
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
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
};
