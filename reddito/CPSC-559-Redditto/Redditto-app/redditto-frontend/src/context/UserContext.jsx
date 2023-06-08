import React, { useContext, useState } from 'react';

export const UserContext = React.createContext({
    isUserSignedIn: false,
    usernameFromContext: "",
    userMajorFromContext: "",
    setUserNameForContext(){},
    setUserMajorForContext(){},
    acknowledgeSignIn(){}
})

export const useUserContext = () => {
  return(
    useContext(UserContext)
  )
}

export const UserContextProvider = ({ children }) => {
    const [isUserSignedIn, acknowledgeSignIn] = useState(false);
    const [usernameFromContext, setUserNameForContext] = useState("");
    const [userMajorFromContext, setUserMajorForContext] = useState("");
  
    return (
      <>
        <UserContext.Provider value={{ isUserSignedIn, acknowledgeSignIn, usernameFromContext, setUserNameForContext, userMajorFromContext, setUserMajorForContext}}>
            {children}
        </UserContext.Provider>
      </>
    );
  };