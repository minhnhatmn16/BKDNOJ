import UserProfile from "./UserProfile";
import { Profile } from "../types";

const generateHeatmapData = (): { date: string; count: number }[] => {
  const daysInYear = 365;
  const today = new Date();
  const data = [];

  for (let i = 0; i < daysInYear; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const isoDate = date.toISOString().split("T")[0];
    const count = Math.floor(Math.random() * 8); // 0 to 7 submissions randomly

    data.push({ date: isoDate, count });
  }
  return data.reverse();
};

export const UserProfilePage = () => {
  const userProfileData: Profile = {
    id: "001",
    username: "MinhNhatmn16",
    email: "minhnhatmn16@gmail.com",
    solvedProblems: 210,
    heatmapData: generateHeatmapData(),
    imageUrl:
      "https://cdn11.bigcommerce.com/s-ydriczk/images/stencil/1500x1500/products/88925/92965/The-Secret-Life-of-Pets-Snowball-cardboard-cutout-buy-now-at-starstills__82058.1559324158.jpg?c=2&imbypass=<on></on>",
  };

  return (
    <div className="one-column-wrapper">
      <UserProfile title="Past Contests" profile={userProfileData} />
    </div>
  );
};

export default UserProfilePage;
