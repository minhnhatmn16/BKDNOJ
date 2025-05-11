import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Contest, Problem, Standing, Submission } from "../types";
import api from "../../api";

import ListProblemsTable from "./ListProblemsTable";
import SubmissionTable from "../submission/SubmissionTable";
import StandingTable from "../standings/StandingTable";

interface DetailContestProps {
  title: string;
  detail_contest: Contest;
}
const DetailContest = ({ title, detail_contest }: DetailContestProps) => {
  const [activeTab, setActiveTab] = useState<"problems" | "status" | "standing" | "mysubmissions">(
    "problems",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const [mysubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [hasLoaded, setHasLoaded] = useState({
    mysubmissions: false,
    status: false,
    standing: false,
  });

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", { hour12: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "mysubmissions" && !hasLoaded.mysubmissions) {
          const res = await api.get(`/contest/${detail_contest.contest_id}/mysubmissions`);
          setMySubmissions(res.data.data);
          setHasLoaded((prev) => ({ ...prev, mysubmissions: true }));
        }
        if (activeTab === "status" && !hasLoaded.status) {
          const res = await api.get(`/contest/${detail_contest.contest_id}/submissions`);
          setSubmissions(res.data.data);
          setHasLoaded((prev) => ({ ...prev, status: true }));
        }
        if (activeTab === "standing" && !hasLoaded.standing) {
          const res = await api.get(`/contest/${detail_contest.contest_id}/ranking`);
          setStandings(res.data.data.rankings);
          setProblems(res.data.data.problems);
          setHasLoaded((prev) => ({ ...prev, standing: true }));
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [activeTab, detail_contest.contest_id, hasLoaded]);

  return (
    <div className="one-column-element mb-6">
      <h4 className="p-3 text-center text-2xl font-bold text-primary">
        {detail_contest.contest_name}
      </h4>
      <h4 className="p-3 text-center text-2xl text-primary">Contest is running</h4>
      <p className="mb-2 text-center text-sm text-gray-500">
        The contest will end in: {getCurrentTime()}
      </p>

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
              activeTab === "mysubmissions"
                ? "bg-gray-200 font-semibold text-black"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveTab("mysubmissions")}
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
          list_problem={detail_contest.Contest_Problems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "mysubmissions" && (
        <SubmissionTable title="My contest submissions" submissions={mysubmissions} />
      )}
      {activeTab === "status" && (
        <SubmissionTable title="Contest status" submissions={submissions} />
      )}
      {activeTab === "standing" && (
        <StandingTable title="Contest standings" problems={problems} standings={standings} />
      )}
    </div>
  );
};

export default DetailContest;
