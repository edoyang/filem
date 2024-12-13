import { Link, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Movies from "./pages/Movies";

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
        </Routes>
      </div>
      <footer>Footer</footer>
    </>
  );
}

export default App;
