import { createContext, useState } from 'react';  

export const AppContext = createContext();  

export const AppProvider = ({ children, initialSessionName = 'SessionName' }) => {  
  const [sessionName, setSessionName] = useState(initialSessionName);  

  return (  
    <AppContext.Provider value={{ sessionName, setSessionName }}>  
      {children}  
    </AppContext.Provider>  
  );  
};  