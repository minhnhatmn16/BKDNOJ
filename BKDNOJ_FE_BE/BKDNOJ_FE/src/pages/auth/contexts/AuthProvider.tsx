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
          const decoded: DecodedToken = jwtDecode(token);
          const res = await api.get(`auth/profile/${decoded.user_name}`);
          console.log(res.data.data);
          setUser({
            user_name: res.data.data.profile.user_name,
            avatar: res.data.data.profile.avatar || "/default-avatar.png",
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
