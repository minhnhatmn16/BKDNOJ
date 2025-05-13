import { useEffect, useState } from "react";
import { AuthContext, User } from "./authContext";
import { getCurrentUser } from "../../../api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser()
        .then((res) => setUser(res.data.data))
        .catch(() => setUser(null));
    }
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
