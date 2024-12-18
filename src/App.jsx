import { Link, Route, Routes } from "react-router";
import "./App.css";
import "./Responsive.css";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Movie from "./pages/Movie";

function App() {
  return (
    <>
      <header>
        <div className="list">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
        </div>
      </header>
      <div className="content">
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/movies" Component={Movies} />
          <Route path="/movie/:id" Component={Movie} />
        </Routes>
      </div>
      <footer>Footer</footer>
    </>
  );
}

export default App;
