import { Link, Route, Routes } from "react-router";
import "./App.css";
import "./Responsive.css";
import Home from "./pages/Home";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Movie from "./pages/Movie";
import Header from "./components/Header";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/login" Component={Login} />
          <Route path="/movie/:id" Component={Movie} />
        </Routes>
      </div>
      <footer>Footer</footer>
    </>
  );
}

export default App;
