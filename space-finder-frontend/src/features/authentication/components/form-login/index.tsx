import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../common/input";
import useAuth from "../../hooks/useAuth";
import { authLogin, getAuthenticatedUser } from "../../services/authService";
import styles from "./styles.module.css";

export default function FormLogin() {
  const ref = useRef<HTMLFormElement>(null);
  const [infoLogin, setInfoLogin] = useState<string>("");
  const navigate = useNavigate();
  const { setUserLogin, setCredentials } = useAuth();

  async function handleAuth(username: string, password: string) {
    const resp = await authLogin({ username, password });
    if (resp?.credentials) {
      setCredentials(resp.credentials);
    }
    const user = await getAuthenticatedUser();
    return user;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (ref.current) {
      const formData = new FormData(ref.current);
      const username = formData.get("username")?.toString();
      const password = formData.get("password")?.toString();
      if (username && password) {
        const user = await handleAuth(username, password);
        if (user) {
          setUserLogin(user);
          navigate("/spaces");
        } else {
          setInfoLogin("username or password is invalid");
        }
      } else {
        setInfoLogin("username and password are required");
      }
    }
  }

  return (
    <form className={styles.container} ref={ref} onSubmit={handleSubmit} noValidate>
      <Input
        id="username"
        name="username"
        label="Username"
        placeholder="username"
        required={true}
      />
      <Input
        id="password"
        type="password"
        name="password"
        label="Password"
        placeholder="********"
        required={true}
      />
      <button type="submit">Access</button>
      <span>{infoLogin}</span>
    </form>
  );
}
