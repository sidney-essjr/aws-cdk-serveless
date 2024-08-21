import { Navigate } from "react-router-dom";
import useAuth from "../features/authentication/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userLogin } = useAuth();

  if (userLogin?.signInOutput) {
    return children;
  } else {
    return <Navigate to={"/login"} />;
  }
}
