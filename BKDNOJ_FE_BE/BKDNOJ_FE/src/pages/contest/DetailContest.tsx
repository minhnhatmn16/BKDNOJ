import { useState } from "react";
import { Link } from "react-router-dom";
import { Contest, Problem, Standing, Submission } from "../types";

import ListProblemsTable from "../list_problem/ListProblemTable";
import SubmissionTable from "../submission/SubmissionTable";
import StandingTable from "../standings/StandingTable";

interface DetailContestProps {
  title: string;
  detail_contest: Contest;
}

const listProblem: Problem[] = [
  {
    id: "1",
    solved: true,
    title: "Problem 1",
    acPercentage: 80,
    solved_count: 100,
    timeLimit: "3s",
    memoryLimit: "262144 KB",
  },
  {
    id: "2",
    solved: false,
    title: "Problem 2",
    acPercentage: 60,
    solved_count: 50,
    timeLimit: "3s",
    memoryLimit: "262144 KB",
  },
];

const standings: Standing[] = [
  {
    rank: 1,
    user: "Minh Nhat",
    point: "100",
    penalty: "01:03:30",
    problems: [
      {
        point: "100",
        time: "19:02:17",
      },
    ],
  },
  {
    rank: 2,
    user: "Xuan Toan",
    point: "100",
    penalty: "01:03:30",
    problems: Array(7).fill({
      point: "100",
      time: "19:02:17",
    }),
  },
];

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

const DetailContest = ({ title, detail_contest }: DetailContestProps) => {
  const [activeTab, setActiveTab] = useState<"problems" | "status" | "standing" | "submissions">(
    "problems",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", { hour12: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="one-column-element mb-6">
      <h4 className="p-3 text-center text-2xl font-bold text-primary">{detail_contest.name}</h4>
      <h4 className="p-3 text-center text-2xl text-primary">Contest is running</h4>
      <p className="mb-2 text-center text-sm text-gray-500">Current Time: {getCurrentTime()}</p>

      <nav className="navbar border-b bg-white py-4">
        <div className="container flex flex-wrap items-center space-x-8">
          <button
            className={`nav-link rounded px-4 py-2 ${
              activeTab === "problems"
                ? "bg-gray-200 font-semibold text-black"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveTab("problems")}
          >
            Problems
          </button>
          <button
            className={`nav-link rounded px-4 py-2 ${
              activeTab === "submissions"
                ? "bg-gray-200 font-semibold text-black"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveTab("submissions")}
          >
            My Submissions
          </button>
          <button
            className={`nav-link rounded px-4 py-2 ${
              activeTab === "status"
                ? "bg-gray-200 font-semibold text-black"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveTab("status")}
          >
            Status
          </button>
          <button
            className={`nav-link rounded px-4 py-2 ${
              activeTab === "standing"
                ? "bg-gray-200 font-semibold text-black"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveTab("standing")}
          >
            Standing
          </button>
        </div>
      </nav>

      {activeTab === "problems" && (
        <ListProblemsTable
          title="Problems"
          list_problem={listProblem}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "submissions" && (
        <SubmissionTable title="My contest submissions" submissions={submissions} />
      )}
      {activeTab === "status" && (
        <SubmissionTable title="Contest status" submissions={submissions} />
      )}
      {activeTab === "standing" && (
        <StandingTable title="Contest standings" standings={standings} />
      )}
    </div>
  );
};

export default DetailContest;
