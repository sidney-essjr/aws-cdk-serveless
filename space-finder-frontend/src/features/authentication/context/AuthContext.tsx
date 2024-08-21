import { AuthUser } from "@aws-amplify/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { getAuthenticatedUser } from "../services/authService";

interface AuthContextProps {
  userLogin: AuthUser | null;
  setUserLogin: (userLogin: AuthUser | null) => void;
}

const initialState: AuthContextProps = {
  userLogin: null,
  setUserLogin: () => {},
};

export const AuthContext = createContext<AuthContextProps>(initialState);

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [userLogin, setUserLogin] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function getUser() {
      const data = await getAuthenticatedUser();
      if (data) {
        setUserLogin(data);
      } else {
        setUserLogin(null);
      }
    }
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userLogin,
        setUserLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
