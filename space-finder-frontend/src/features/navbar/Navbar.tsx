import { NavLink } from "react-router-dom";
import { UserLogin } from "../authentication/context/AuthContext";
import useAuth from "../authentication/hooks/useAuth";
import { authLogout } from "../authentication/services/authService";
import styles from "./styles.module.css";

function handleLogout(setUserLogin: (userLogin: UserLogin) => void) {
  authLogout();
  setUserLogin({ username: "", credentials: null, signInOutput: null });
}

export default function Navbar() {
  const { setUserLogin } = useAuth();
  const { userLogin } = useAuth();
  function renderLoginLogout() {
    if (userLogin?.username) {
      return (
        <NavLink to="/" onClick={() => handleLogout(setUserLogin)}>
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
