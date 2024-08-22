import { AuthUser } from "@aws-amplify/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { getAuthenticatedUser } from "../services/authService";

export interface AwsCredentialIdentity {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly sessionToken?: string;
  readonly credentialScope?: string;
  readonly accountId?: string;
}
interface AuthContextProps {
  userLogin: AuthUser | null;
  setUserLogin: (userLogin: AuthUser | null) => void;
  credentials: AwsCredentialIdentity | null;
  setCredentials: (credentials: AwsCredentialIdentity | null) => void;
}

const initialState: AuthContextProps = {
  userLogin: null,
  setUserLogin: () => {},
  credentials: null,
  setCredentials: () => {},
};

export const AuthContext = createContext<AuthContextProps>(initialState);

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [userLogin, setUserLogin] = useState<AuthUser | null>(null);
  const [credentials, setCredentials] = useState<AwsCredentialIdentity | null>(null);

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
        credentials,
        setUserLogin,
        setCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
