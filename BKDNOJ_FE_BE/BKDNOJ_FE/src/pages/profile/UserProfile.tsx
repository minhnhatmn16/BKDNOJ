import { Profile } from "../types";

interface UserProfileProps {
  title: string;
  profile: Profile;
}

const UserProfilePage = ({ title, profile }: UserProfileProps) => {
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count < 3) return "bg-green-200";
    if (count < 6) return "bg-green-400";
    return "bg-green-600";
  };

  const weeks = [];
  for (let i = 0; i < profile.heatmapData.length; i += 7) {
    weeks.push(profile.heatmapData.slice(i, i + 7));
  }

  return (
    <div className="one-column-element mb-6">
      {/* User Info Card */}
      <div className="mb-4 overflow-hidden rounded-md border border-gray-300">
        <div className="flex flex-col p-4">
          <h1 className="ml-4 text-2xl font-bold">{profile.username}</h1>
          <img
            src={profile.imageUrl}
            alt="Profile"
            className="ml-4 h-[300px] w-[300px] rounded-md border border-gray-300 object-cover"
          />
        </div>
      </div>

      {/* Submission Heatmap */}
      <div className="overflow-hidden rounded-md border border-gray-300">
        <div className="flex justify-center p-4">
          <div className="overflow-auto">
            <h2 className="mb-2 text-center text-lg font-semibold">Submission Activity</h2>
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className={`h-4 w-4 rounded ${getColor(day.count)}`}
                      title={`${day.date}: ${day.count} submissions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
