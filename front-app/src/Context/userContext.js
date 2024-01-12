// import React, { createContext, useContext, useState } from 'react';
//
// const UserContext = createContext();
//
// export const UserProvider = ({ children }) => {
//     const [authState, setAuthState] = useState({ user: null, token: null });
//
//     const loginUser = (userData) => {
//         setAuthState({ user: userData.user, token: userData.token });
//     };
//
//     const logoutUser = () => {
//         setAuthState({ user: null, token: null });
//     };
//
//     return (
//         <UserContext.Provider value={{ authState, loginUser, logoutUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };
//
// export const useUser = () => useContext(UserContext);
