import React from "react";
import Hero from "../../components/Hero";
import MovieSlider from "../../components/MovieSlider";
import { genres } from "../../utils/apiHelper";

const Home = () => {
  return (
    <div>
      <Hero />
      <MovieSlider genre={genres.Horror} />
      <MovieSlider genre={genres.RecentlyAdded} />
      <MovieSlider genre={genres.Action} />
    </div>
  );
};

export default Home;
