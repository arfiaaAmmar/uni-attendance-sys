import { createContext, useMemo, useState } from "react";
import { Admin } from "@shared-library/types";

interface AuthContextProps {
  user: Admin | null;
  isLoggedIn: boolean | null;
  setUser: React.Dispatch<React.SetStateAction<Admin | null>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoggedIn: false,
  setUser: () => {},
  setIsLoggedIn: () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);
  const contextValueObj = useMemo(() => ({user, setUser, isLoggedIn, setIsLoggedIn}), []);

  return (
    <AuthContext.Provider value={contextValueObj}>
      {children}
    </AuthContext.Provider>
  );
};
