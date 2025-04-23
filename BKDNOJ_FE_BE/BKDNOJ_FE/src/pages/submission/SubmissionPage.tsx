import SubmissionTable from "./SubmissionTable";
import { Submission } from "../types";

const submissions: Submission[] = [
  {
    id: "#0001",
    status: "AC",
    language: "C++17",
    user_name: "PhanGiaKhang",
    problemTitle: "Cây khung nhỏ nhất (HEAP)",
    date: "2025/04/15",
    time: "19:02:17",
    execTime: "0.03s",
    memory: "10.2 MB",
    score: "1 / 1",
    colorClass: "bg-green-200",
  },
  {
    id: "#0002",
    status: "WA",
    language: "C++20",
    user_name: "thanhtriet1007",
    problemTitle: "VM 15 Bài 10 - Thành phố cổ",
    date: "2025/04/15",
    time: "19:02:17",
    execTime: "0.86s",
    memory: "46.4 MB",
    score: "0 / 20",
    colorClass: "bg-red-200",
  },
];

export const SubmissionsPage = () => {
  return (
    <div className="one-column-wrapper">
      <SubmissionTable title="Submissions" submissions={submissions} />
    </div>
  );
};

export default SubmissionsPage;
