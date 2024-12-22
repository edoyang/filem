import React from "react";
import Hero from "../../components/Hero";
import MovieSlider from "../../components/MovieSlider";
import { genres } from "../../utils/apiHelper";

const Home = () => {
  return (
    <div>
      <Hero />
      <MovieSlider />
      <MovieSlider genre={genres.Horror} />
      <MovieSlider genre={genres.Action} />
      <MovieSlider genre={genres.Thriller} />
      <MovieSlider genre={genres.Comedy} />
      <MovieSlider genre={genres.Romance} />
      <MovieSlider genre={genres.Adventure} />
      <MovieSlider genre={genres.Animation} />
      <MovieSlider genre={genres.Crime} />
      <MovieSlider genre={genres.Documentary} />
      <MovieSlider genre={genres.Drama} />
      <MovieSlider genre={genres.Fantasy} />
      <MovieSlider genre={genres.ScienceFiction} />
      <MovieSlider genre={genres.War} />
    </div>
  );
};

export default Home;
