import { useEffect, useState } from "react";
import { Problem, Submission } from "../types";
import api from "../../api";
import SubmissionTable from "../submission/SubmissionTable";
import SubmitPage from "../submit/SubmitPage";
import PdfViewer from "../../components/utils/PdfViewer";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import SubmissionCodeModal from "../submission/SubmissionCodeModal";

interface DetailProblemProps {
  title: string;
  detail_problem: Problem;
  activeTab: "problem" | "submit" | "mysubmissions" | "status";
}
const getDirectDriveLink = (link: string): string => {
  const match = link.match(/\/d\/(.+?)\//);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : link;
};
const DetailProblem = ({ title, detail_problem, activeTab }: DetailProblemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mysubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [hasLoaded, setHasLoaded] = useState({
    problem: false,
    submit: false,
    mysubmissions: false,
    status: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [user_id, setUserId] = useState<number>();
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleTabChange = (tab: string) => {
    if (tab === "problem") {
      navigate(`/problem/${detail_problem.problem_id}`);
    } else {
      navigate(`/problem/${detail_problem.problem_id}/${tab}`);
    }
  };

  const fetchMyProfile = async () => {
    try {
      const res = await api.get(`/auth/profile`);
      setUserId(res.data.data.profile.user_id);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", { hour12: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "problem" && !hasLoaded.problem) {
          setHasLoaded((prev) => ({ ...prev, problem: true }));
        } else if (activeTab === "submit" && !hasLoaded.submit) {
          setHasLoaded((prev) => ({ ...prev, submit: true }));
        } else if (activeTab === "mysubmissions" && !hasLoaded.mysubmissions) {
          fetchMyProfile();
          const res = await api.get(`/problem/${detail_problem.problem_id}/mysubmissions`);
          setMySubmissions(res.data.data.mysubmissions);
          setHasLoaded((prev) => ({ ...prev, mysubmissions: true }));
        } else if (activeTab === "status" && !hasLoaded.status) {
          fetchMyProfile();
          const res = await api.get(`/problem/${detail_problem.problem_id}/submissions`);
          setSubmissions(res.data.data.submissions);
          setHasLoaded((prev) => ({ ...prev, status: true }));
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [activeTab, detail_problem.problem_id, hasLoaded]);

  return (
    <div className="one-column-element mb-6">
      <h4 className="p-3 text-center text-2xl font-bold text-primary">
        {detail_problem.problem_name}
      </h4>
      <div className="flex flex-col p-4 text-center">
        <h1 className="space-y-1 text-center text-sm text-gray-500">
          <strong>Time limit:</strong> {(parseFloat(detail_problem.timelimit_ms) / 1000).toFixed(2)}{" "}
          s
        </h1>

        <h1 className="space-y-1 text-center text-sm text-gray-500">
          <strong>Memory limit:</strong> {detail_problem.memorylimit_kb} MB
        </h1>
      </div>

      <nav className="navbar border-b bg-white py-4">
        <div className="container flex flex-wrap items-center space-x-8">
          {["problem", "submit", "mysubmissions", "status"].map((tab) => (
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

      {activeTab === "problem" && (
        <div className="mt-4">
          {detail_problem.link && <PdfViewer pdfUrl={getDirectDriveLink(detail_problem.link)} />}
        </div>
      )}
      {activeTab === "submit" && <SubmitPage problem={detail_problem} />}
      {activeTab === "mysubmissions" && (
        <SubmissionTable
          title="My submissions"
          submissions={mysubmissions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSubmissionClick={(id) => setViewingId(id)}
          currentUserId={user_id || -1}
        />
      )}
      {activeTab === "status" && (
        <SubmissionTable
          title="Status"
          submissions={submissions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSubmissionClick={(id) => setViewingId(id)}
          currentUserId={user_id || -1}
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

export default DetailProblem;
