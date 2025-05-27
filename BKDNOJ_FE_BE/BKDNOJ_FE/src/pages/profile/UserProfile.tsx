import { Profile, HeatmapDay } from "../types";
import { useState } from "react";

interface UserProfileProps {
  title: string;
  profile: Profile;
  sumissionsInYear: HeatmapDay[];
}

const UserProfilePage = ({ title, profile, sumissionsInYear }: UserProfileProps) => {
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count < 3) return "bg-green-200";
    if (count < 6) return "bg-green-400";
    return "bg-green-600";
  };

  const yearCur = new Date().getFullYear();

  const startDate = new Date(Date.UTC(yearCur, 0, 1, 0, 0, 0, 1));
  const endDate = new Date(Date.UTC(yearCur, 11, 31, 23, 59, 59, 999));

  const allDays: HeatmapDay[] = [];
  const dateToSubmissionMap: Record<string, number> = {};

  for (const s of sumissionsInYear) {
    dateToSubmissionMap[s.date] = s.count;
  }

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    allDays.push({
      date: dateStr,
      count: dateToSubmissionMap[dateStr] || 0,
    });
  }

  const firstDayOfWeek = startDate.getDay();
  const offset = (firstDayOfWeek + 6) % 7;

  const paddedDays: HeatmapDay[] = [
    ...Array(offset)
      .fill(null)
      .map(() => ({ date: "", count: 0 })),
    ...allDays,
  ];

  const weeks: HeatmapDay[][] = [];
  const week: HeatmapDay[] = [];
  for (let i = 0; i < paddedDays.length; i += 7) weeks.push(paddedDays.slice(i, i + 7));

  const daysOfWeek = ["Mon", "Wed", "Fri"];

  const getMonthLabels = () => {
    const labels: (string | null)[] = [];
    let prevMonth = "";

    for (const week of weeks) {
      const firstDay = week.find((d) => d?.date);
      if (!firstDay || !firstDay.date) {
        labels.push(null);
        continue;
      }

      const month = new Date(firstDay.date).toLocaleString("en-US", { month: "short" });
      if (month !== prevMonth) {
        labels.push(month);
        prevMonth = month;
      } else {
        labels.push(null);
      }
    }
    return labels;
  };

  const monthLabels = getMonthLabels();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ["jpg", "jpeg", "png"];
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split(".").pop();

      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        alert("Please select a valid image file (jpg, jpeg, png).");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    console.log("Uploading:", selectedFile);
    window.location.reload();
  };
  return (
    <div className="one-column-element mb-6">
      {/* User Info */}
      <div className="mb-4 overflow-hidden rounded-md border border-gray-300">
        <div className="flex flex-col p-4">
          <h1 className="ml-4 text-2xl font-bold">{profile.user_name}</h1>
          <div className="ml-4 w-fit rounded-md border border-gray-300 p-4">
            <img
              src={profile.avatar}
              alt="Profile"
              className="h-[300px] w-[300px] rounded-md border border-gray-300 object-cover"
            />

            <div className="mt-2 text-sm text-blue-600">
              <button
                onClick={() => document.getElementById("fileInput")?.click()}
                className="hover:underline"
              >
                Change photo
              </button>
              {selectedFile && <span className="ml-2 text-gray-700">({selectedFile.name})</span>}
            </div>

            {selectedFile && (
              <div className="mt-2">
                <button
                  onClick={handleUpload}
                  className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                >
                  Upload
                </button>
              </div>
            )}

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-hidden rounded-md border border-gray-300">
        <div className="flex flex-col items-center p-4">
          <h2 className="mb-2 text-center text-lg font-semibold">Submission Activity</h2>

          <div className="flex items-start">
            {/* Cột ngày */}
            <div className="mr-5 mt-3 flex h-[112px] flex-col justify-between">
              {daysOfWeek.map((day) => (
                <div key={day} className="w-4 text-center text-xs text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              {/* Tên tháng */}
              <div className="mb-1 ml-6 flex gap-1">
                {monthLabels.map((label, index) => (
                  <div key={index} className="w-4 text-center text-xs text-gray-500">
                    {label ?? ""}
                  </div>
                ))}
              </div>

              {/* Grid heatmap */}
              <div className="flex gap-1">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day, di) => (
                      <div
                        key={di}
                        className={`h-4 w-4 rounded ${
                          day.date ? getColor(day.count) : "bg-transparent"
                        }`}
                        title={day.date ? `${day.date}: ${day.count} submissions` : ""}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
