import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import FormLogin from "../../features/authentication/components/form-login";

export default function LoginPage() {
    return (
        <section className={styles.container}>
            <h1>Acesse sua conta</h1>
            <FormLogin />
            <p>
                Ainda não tem conta? <Link to="/create-account">Crie sua conta</Link>
            </p>
        </section>
    );
}
