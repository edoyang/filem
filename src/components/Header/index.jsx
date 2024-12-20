import "./style.scss";
import { Link } from "react-router";

const Header = () => {
  return (
    <header>
      <Link to="/" className="logo">
        <span>F</span>
        <span>I</span>
        <span>L</span>
        <span>E</span>
        <span>M</span>
      </Link>
      <div className="list">
        <Link to="/login">Login</Link>
      </div>
    </header>
  );
};

export default Header;
