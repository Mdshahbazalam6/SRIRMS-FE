// import { createContext, useEffect, useState } from "react";

import { createContext, useState } from "react";

// export const UserAuthContext = createContext({
//   user: null,
//   login: (userData: any, token: string) => {},
//   logout: () => {},
// });

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");

//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = (userData: any, token: string) => {
//     sessionStorage.setItem("user", JSON.stringify(userData));

//     sessionStorage.setItem("userToken", token);

//     setUser(userData);
//   };

//   const logout = () => {
//     sessionStorage.clear();

//     setUser(null);
//   };

//   return (
//     <UserAuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </UserAuthContext.Provider>
//   );
// };

// export default AuthProvider;

export const AuthContext = createContext({
  user: null,
  admin: null,
  userToken: null,
  adminToken: null,
  login: (data: any, token: string, role: "ADMIN" | "USER") => {},
  logout: (role: "ADMIN" | "USER") => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState({
    user: JSON.parse(sessionStorage.getItem("user_data") || "null"),
    userToken: sessionStorage.getItem("user_token") || null,
    admin: JSON.parse(sessionStorage.getItem("admin_data") || "null"),
    adminToken: sessionStorage.getItem("admin_token") || null,
  });

  const login = (data: any, token: string, role: "ADMIN" | "USER") => {
    if (role === "ADMIN") {
      sessionStorage.setItem("admin_data", JSON.stringify(data));
      sessionStorage.setItem("admin_token", token);
      setAuthState((prev) => ({ ...prev, admin: data, adminToken: token }));
    } else {
      sessionStorage.setItem("user_data", JSON.stringify(data));
      sessionStorage.setItem("user_token", token);
      setAuthState((prev) => ({ ...prev, user: data, userToken: token }));
    }
  };

  const logout = (role: "ADMIN" | "USER") => {
    if (role === "ADMIN") {
      sessionStorage.removeItem("admin_data");
      sessionStorage.removeItem("admin_token");
      setAuthState((prev) => ({ ...prev, admin: null, adminToken: null }));
    } else {
      sessionStorage.removeItem("user_data");
      sessionStorage.removeItem("user_token");
      setAuthState((prev) => ({ ...prev, user: null, userToken: null }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        admin: authState.admin,
        // @ts-ignore
        userToken: authState.userToken,
        // @ts-ignore
        adminToken: authState.adminToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
