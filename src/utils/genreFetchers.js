import { genres } from "./apiHelper";

const genreFetchers = {
  "Unleash the Action": genres.Action,
  "Embark the Adventure": genres.Adventure,
  "Animated Wonders": genres.Animation,
  "Comedy Movies": genres.Comedy,
  "Crime Movies": genres.Crime,
  "Explore Documentary": genres.Documentary,
  "Drama Movies": genres.Drama,
  "Fantasy Movies": genres.Fantasy,
  "Horiffic Sensation": genres.Horror,
  "Love in the Air": genres.Romance,
  "It's time for Science!": genres.ScienceFiction,
  "Feel the Thrill": genres.Thriller,
  "War Movies": genres.War,
  "Recently Added": genres.RecentlyAdded,
};

export default genreFetchers;
