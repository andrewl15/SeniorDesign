import { Link } from "react-router-dom";
import '../styles/Navigation.css';
// BrowserRouter, Route, 
function Navbar() {
    return (
      <nav>
        <ul className = "NavigationBar">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/App">Gene Search</Link>
          </li>
          <li>
            <Link to="/About">About</Link>
          </li>
        </ul>
      </nav>
    );
  }


  export default Navbar;