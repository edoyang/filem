import React from "react";
import Hero from "../../components/Hero";
import MovieSlider from "../../components/MovieSlider";
import {
  genres,
  fetchUpcomingMovies,
  fetchPopularMovies,
  fetchNowPlayingMovies,
} from "../../utils/apiHelper";

const Home = () => {
  return (
    <div>
      {/* Hero is highest priority - loads first */}
      <Hero />

      {/* Priority 0: Load these first - they're visible "above the fold" */}
      <MovieSlider
        genre={fetchPopularMovies}
        priority={0}
        title="Popular Movies"
      />

      <MovieSlider
        genre={fetchUpcomingMovies}
        priority={0}
        title="Upcoming Movies"
      />

      <MovieSlider genre={genres.Horror} priority={1} title="Horror" />

      {/* Priority 2: Load these after the first two groups */}
      <MovieSlider genre={genres.Action} priority={2} title="Action" />

      <MovieSlider genre={genres.Thriller} priority={2} title="Thriller" />

      {/* Priority 3 and beyond: Load these last - might require scrolling to see */}
      <MovieSlider genre={genres.Comedy} priority={3} title="Comedy" />

      <MovieSlider genre={genres.Romance} priority={3} title="Romance" />

      <MovieSlider genre={genres.Adventure} priority={4} title="Adventure" />

      <MovieSlider genre={genres.Animation} priority={4} title="Animation" />

      <MovieSlider genre={genres.Crime} priority={5} title="Crime" />

      <MovieSlider
        genre={genres.Documentary}
        priority={5}
        title="Documentary"
      />

      <MovieSlider genre={genres.Drama} priority={6} title="Drama" />

      <MovieSlider genre={genres.Fantasy} priority={6} title="Fantasy" />

      <MovieSlider
        genre={genres.ScienceFiction}
        priority={7}
        title="Science Fiction"
      />

      <MovieSlider genre={genres.War} priority={7} title="War" />
    </div>
  );
};

export default Home;
