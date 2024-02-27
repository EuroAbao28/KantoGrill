import React, { createContext, useContext, useState } from "react";

// Create a context object
const UserContext = createContext();

// Custom hook to access the context value
export const useUserContext = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
