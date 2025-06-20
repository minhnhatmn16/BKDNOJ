import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Contest, Problem, Standing, Submission, ContestProblem } from "../types";
import api from "../../api";

import ListProblemsTable from "./ListProblemsTable";
import SubmissionTable from "../submission/SubmissionTable";
import StandingTable from "../standings/StandingTable";
import ContestStatusTimer from "../../components/layout/ContestStatusTimer";
import SubmissionCodeModal from "../submission/SubmissionCodeModal";
import DetailProblemInContest from "./DetailProblemInContest";
import { notifyError, notifySuccess } from "../../components/utils/ApiNotifier";

interface DetailContestProps {
  title: string;
  detail_contest: Contest;
  activeTab: "problems" | "status" | "standing" | "mysubmissions" | "detailproblem";
  selectedProblemId?: string;
}

const DetailContest = ({
  title,
  detail_contest,
  activeTab,
  selectedProblemId,
}: DetailContestProps) => {
  const navigate = useNavigate();

  const [mysubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [detailProblem, setDetailProblem] = useState<ContestProblem>();
  const [format, setFormat] = useState(detail_contest.format);
  const [hasLoaded, setHasLoaded] = useState({
    mysubmissions: false,
    status: false,
    standing: false,
    detailproblem: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [user_id, setUserId] = useState<number>();
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleTabChange = (tab: string) => {
    navigate(`/contest/${detail_contest.contest_id}/${tab}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", { hour12: false });
  };

  const fetchMyProfile = async () => {
    try {
      const res = await api.get(`/auth/profile`);
      setUserId(res.data.data.profile.user_id);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "mysubmissions" && !hasLoaded.mysubmissions) {
          fetchMyProfile();
          const res = await api.get(`/contest/${detail_contest.contest_id}/mysubmissions`);
          setMySubmissions(res.data.data.mysubmissions);
          setHasLoaded((prev) => ({ ...prev, mysubmissions: true }));
        }
        if (activeTab === "status" && !hasLoaded.status) {
          fetchMyProfile();
          const res = await api.get(`/contest/${detail_contest.contest_id}/submissions`);
          setSubmissions(res.data.data.submissions);
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

  useEffect(() => {
    if (activeTab === "detailproblem" && selectedProblemId) {
      const fetchDetailProblem = async () => {
        try {
          const res = await api.get(
            `/contest/${detail_contest.contest_id}/problem/${selectedProblemId}`,
          );
          setDetailProblem(res.data.data);
        } catch (error: any) {
          console.error("Problem failed:", error);
          const message = error.response?.data?.error || error.message || "Problem not found.";
          notifyError(`${message}`);
          navigate(`/contest/${detail_contest.contest_id}/problems}`);
        }
      };
      fetchDetailProblem();
    }
  }, [activeTab, selectedProblemId, detail_contest.contest_id]);

  return (
    <div className="one-column-element mb-6">
      <h4 className="p-3 text-center text-2xl font-bold text-primary">
        {detail_contest.contest_name}
      </h4>
      <h4 className="space-y-1 text-center text-sm text-gray-500">
        <strong>Format:</strong> {format}
      </h4>

      <ContestStatusTimer
        startTime={detail_contest.start_time}
        duration={detail_contest.duration}
      />

      <nav className="navbar border-b bg-white py-4">
        <div className="container flex flex-wrap items-center space-x-8">
          {["problems", "mysubmissions", "status", "standing"].map((tab) => (
            <button
              key={tab}
              className={`nav-link rounded px-4 py-2 ${
                activeTab === tab
                  ? "bg-gray-200 font-semibold text-black"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === "mysubmissions"
                ? "My Submissions"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {activeTab === "problems" && (
        <ListProblemsTable
          title="Problems"
          contest_id={detail_contest.contest_id}
          list_problem={detail_contest.Contest_Problems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "mysubmissions" && (
        <SubmissionTable
          title="My contest submissions"
          submissions={mysubmissions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSubmissionClick={(id) => setViewingId(id)}
          currentUserId={user_id || -1}
          contest_id={detail_contest.contest_id}
        />
      )}
      {activeTab === "status" && (
        <SubmissionTable
          title="Contest status"
          submissions={submissions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSubmissionClick={(id) => setViewingId(id)}
          currentUserId={user_id || -1}
          contest_id={detail_contest.contest_id}
        />
      )}
      {activeTab === "standing" && (
        <StandingTable
          title="Contest standings"
          problems={problems}
          standings={standings}
          format={format}
          contest_id={detail_contest.contest_id}
        />
      )}
      {activeTab === "detailproblem" && detailProblem && (
        <DetailProblemInContest
          title="Detail Problem"
          contest_id={detail_contest.contest_id}
          detail_problem={detailProblem}
        />
      )}
      <SubmissionCodeModal
        open={viewingId !== null}
        submissionId={viewingId}
        onClose={() => setViewingId(null)}
      />
    </div>
  );
};

export default DetailContest;
