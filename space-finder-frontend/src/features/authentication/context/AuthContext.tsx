import { createContext, ReactNode, useState } from "react";
import { SignInOutput } from "@aws-amplify/auth";

export interface AwsCredentialIdentity {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string; // Opcional, se usando sessões temporárias
}

export interface UserLogin {
  credentials: AwsCredentialIdentity | null;
  signInOutput: SignInOutput | null;
  username: string;
}

interface AuthContextProps {
  userLogin: UserLogin | null;
  setUserLogin: (userLogin: UserLogin) => void;
}

const initialState: AuthContextProps = {
  userLogin: null,
  setUserLogin: () => {},
};

export const AuthContext = createContext<AuthContextProps>(initialState);

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [userLogin, setUserLogin] = useState<UserLogin | null>(null);

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
