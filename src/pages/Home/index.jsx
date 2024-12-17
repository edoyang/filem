import React, { useState, useEffect } from "react";
import Hero from "../../components/Hero";
import MovieSlider from "../../components/MovieSlider";

const Home = () => {
  return (
    <div>
      <Hero />
      <MovieSlider />
    </div>
  );
};

export default Home;
