import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface UserContextType {
  username: string | null;
  userTable: string | null;
  login: (username: string, userTable: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userTable, setUserTable] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  useEffect(() => {
    try {
      const storedUsername = localStorage.getItem('cineLogUsername');
      const storedUserTable = localStorage.getItem('cineLogUserTable');
      if (storedUsername && storedUserTable) {
        setUsername(storedUsername);
        setUserTable(storedUserTable);
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      // Handle error, maybe clear localStorage if it's corrupted
      localStorage.removeItem('cineLogUsername');
      localStorage.removeItem('cineLogUserTable');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newUsername: string, newUserTable: string) => {
    localStorage.setItem('cineLogUsername', newUsername);
    localStorage.setItem('cineLogUserTable', newUserTable);
    setUsername(newUsername);
    setUserTable(newUserTable);
  };

  const logout = () => {
    localStorage.removeItem('cineLogUsername');
    localStorage.removeItem('cineLogUserTable');
    setUsername(null);
    setUserTable(null);
  };

  return (
    <UserContext.Provider value={{ username, userTable, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 