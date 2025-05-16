import UserProfile from "./UserProfile";
import { Profile, HeatmapDay } from "../types";
import api from "../../api";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const generateHeatmapData = (inputData: HeatmapDay[]): HeatmapDay[] => {
  const data: HeatmapDay[] = [];

  const yearCur = new Date().getFullYear();

  const inputMap = new Map(inputData.map((item) => [item.date, item.count]));
  const startDate = new Date(Date.UTC(yearCur, 0, 1, 0, 0, 0, 1));
  const daysInYear = (yearCur % 4 === 0 && yearCur % 100 !== 0) || yearCur % 400 === 0 ? 366 : 365;

  for (let i = 0; i < daysInYear; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const isoDate = date.toISOString().split("T")[0];
    const count = inputMap.get(isoDate) || 0;
    data.push({ date: isoDate, count });
  }
  return data;
};

export const UserProfilePage = () => {
  const { user_name } = useParams();
  const [userProfile, setUserProfile] = useState<Profile>();
  const [sumissionsInYear, setSubmssionsInYear] = useState<HeatmapDay[]>([]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get(`auth/profile/${user_name}`);
      setUserProfile(res.data.data.profile);
      setSubmssionsInYear(generateHeatmapData(res.data.data.submissions));
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  }, [user_name]);
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return userProfile ? (
    <div className="one-column-wrapper">
      <UserProfile title="Profile" profile={userProfile} sumissionsInYear={sumissionsInYear} />
    </div>
  ) : (
    <div>Loading profile...</div>
  );
};

export default UserProfilePage;
