import AuthContextProvider from "../features/authentication/context/AuthContext";
import AppRouter from "../router/Router";

export default function App() {
    return (
        <AuthContextProvider>
            <AppRouter />
        </AuthContextProvider>
    );
}
