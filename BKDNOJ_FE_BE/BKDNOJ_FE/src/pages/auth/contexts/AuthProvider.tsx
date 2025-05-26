import { useEffect, useState } from "react";
import { AuthContext, User } from "./authContext";
import { jwtDecode } from "jwt-decode";
import api from "../../../api";

interface DecodedToken {
  user_id: string;
  user_name: string;
  role: string;
  can_create_contest: boolean;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // const decoded: DecodedToken = jwtDecode(token);
          const decoded: DecodedToken & { exp: number } = jwtDecode(token);

          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp < currentTime) {
            console.warn("Token expired");
            localStorage.removeItem("token");
            setUser(null);
            return;
          }
          const res = await api.get(`auth/profile/${decoded.user_name}`);
          setUser({
            user_name: res.data.data.profile.user_name,
            avatar: res.data.data.profile.avatar || "/default-avatar.png",
            role: res.data.data.profile.role,
          });
        } catch (err) {
          console.error("Invalid token", err);
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
