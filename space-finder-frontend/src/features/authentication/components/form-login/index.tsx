import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../common/input";
import useAuth from "../../hooks/useAuth";
import { authLogin } from "../../services/authService";
import styles from "./styles.module.css";

export default function FormLogin() {
  const ref = useRef<HTMLFormElement>(null);
  const [infoLogin, setInfoLogin] = useState<string>("");
  const navigate = useNavigate();
  const { setUserLogin } = useAuth();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (ref.current) {
      const formData = new FormData(ref.current);
      const username = formData.get("username")?.toString();
      const password = formData.get("password")?.toString();
      if (username && password) {
        const response = await authLogin({ username, password });
        if (response?.credentials && response?.signInOutput) {
          navigate("/spaces");
          setUserLogin(response);
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
