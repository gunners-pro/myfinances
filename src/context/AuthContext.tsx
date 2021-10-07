import React, { createContext, ReactNode, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

type AuthContextData = {
  user?: User;
};

const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const user = {
    id: 'dfgihdfig',
    name: 'Fabricyo',
    email: 'teste@teste.com',
  };

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
