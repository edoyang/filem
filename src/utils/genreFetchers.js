import {
  Horror,
  Action,
  Comedy,
  Drama,
  Adventure,
  Crime,
  Documentary,
  Fantasy,
  Romance,
  Science,
  Thriller,
  War,
  fetchRecentlyAddedMovies,
} from "./apiHelper";

const genreFetchers = {
  "Action Movies": Action,
  "Adventure Movies": Adventure,
  "Animation Movies": Animation,
  "Comedy Movies": Comedy,
  "Crime Movies": Crime,
  "Documentary Movies": Documentary,
  "Drama Movies": Drama,
  "Fantasy Movies": Fantasy,
  "Feel the thrill": Horror,
  "Romance Movies": Romance,
  "Science Fiction Movies": Science,
  "Thriller Movies": Thriller,
  "War Movies": War,
  "Recently Added": fetchRecentlyAddedMovies,
};

export default genreFetchers;
