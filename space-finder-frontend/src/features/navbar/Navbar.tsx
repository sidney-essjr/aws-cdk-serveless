import { NavLink } from "react-router-dom";
import useAuth from "../authentication/hooks/useAuth";
import { authLogout } from "../authentication/services/authService";
import styles from "./styles.module.css";

export default function Navbar() {
  const { setUserLogin, userLogin } = useAuth();

  function handleLogout() {
    authLogout();
    setUserLogin(null);
  }

  function renderLoginLogout() {
    if (userLogin?.username) {
      return (
        <NavLink to="/" onClick={handleLogout}>
          {userLogin.username}
        </NavLink>
      );
    } else {
      return <NavLink to="/login">Login</NavLink>;
    }
  }

  return (
    <nav className={styles.navbar}>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink to="/spaces">Spaces</NavLink>
      <NavLink to="/create-space">Create space</NavLink>
      {renderLoginLogout()}
    </nav>
  );
}
