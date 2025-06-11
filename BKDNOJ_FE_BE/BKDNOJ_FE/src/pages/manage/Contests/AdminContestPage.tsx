import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api";
import { Contest, ContestProblem } from "../../types";
import CreateContestModal from "./CreateContestModal";
import UpdateContestModal from "./UpdateContestModal";
import ProblemRejudgeModal from "./ProblemRejudgeModal";
import Pagination from "../../../components/pagination/Pagination";
import { Pencil, RefreshCw } from "lucide-react";
import { notifyError, notifySuccess } from "../../../components/utils/ApiNotifier";

const AdminContestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [contests, setContests] = useState<Contest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContests = async (page: number) => {
    try {
      const res = await api.get(`/admin/contest?page=${page}`);
      setContests(res.data.data.contests);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch contests", err);
    }
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleEditClick = async (contestId: number) => {
    try {
      const res = await api.get(`/admin/contest/${contestId}`);
      setSelectedContest(res.data.data);
      setEditModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch contest details", err);
    }
  };

  const [rejudgeModalOpen, setRejudgeModalOpen] = useState(false);
  const [rejudgeProblems, setRejudgeProblems] = useState<ContestProblem[]>([]);
  const openRejudgeModal = async (contestId: number) => {
    try {
      const res = await api.get(`/admin/contest/${contestId}`);
      setRejudgeProblems(res.data.data.Contest_Problems);
      setRejudgeModalOpen(true);
    } catch (err) {
      console.error("Failed to load problems for rejudge", err);
    }
  };

  const handleRejudgeProblem = async (contestProblemId: number) => {
    try {
      await api.post(`/admin/contest/rejudge`, {
        contest_problem_id: contestProblemId,
      });
      notifySuccess(`Rejudge for problem started.`);
    } catch (err) {
      console.error("Rejudge failed", err);
      notifyError("Failed to rejudge.");
    }
  };

  useEffect(() => {
    fetchContests(currentPage);
  }, [currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`/admin/contest?page=${page}`);
  };

  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="flex items-center justify-between bg-primary p-3 text-xl text-white">
          <span>Manage Contests</span>
          <Link
            to="#"
            onClick={() => setShowModal(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-2xl font-bold text-primary hover:bg-gray-100"
            title="Add Contest"
          >
            +
          </Link>
        </h4>

        <div className="table-responsive">
          <table className="min-w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-center">Name</th>
                <th className="border p-3 text-center">Start Time</th>
                <th className="border p-3 text-center">Duration</th>
                <th className="border p-3 text-center">Status</th>
                <th className="border p-3 text-center">Visibility</th>
                <th className="border p-3 text-center">Format</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => {
                const start = new Date(contest.start_time);
                const end = new Date(start.getTime() + contest.duration * 60000);
                const now = new Date();

                let status = "Upcoming";
                if (now >= end) status = "Ended";
                else if (now >= start && now < end) status = "Running";

                return (
                  <tr key={contest.contest_id} className="border-t">
                    <td className="border p-3 text-center">
                      <Link
                        to={`/contest/${contest.contest_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contest.contest_name}
                      </Link>
                    </td>
                    <td className="border p-3 text-center">{start.toLocaleString()}</td>
                    <td className="border p-3 text-center">{contest.duration} minutes</td>
                    <td className="border p-3 text-center">{status}</td>
                    <td className="border p-3 text-center">
                      {contest.is_public ? "Public" : "Private"}
                    </td>
                    <td className="border p-3 text-center">{contest.format}</td>
                    <td className="space-x-2 border p-3 text-center">
                      <button
                        onClick={() => handleEditClick(contest.contest_id)}
                        className="text-blue-600 underline"
                        title="Edit"
                      >
                        <Pencil className="inline h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openRejudgeModal(contest.contest_id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                        title="Rejudge submissions"
                      >
                        <RefreshCw className="inline h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
      <CreateContestModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <UpdateContestModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        contest={selectedContest}
      />
      {rejudgeModalOpen && (
        <ProblemRejudgeModal
          problems={rejudgeProblems}
          onClose={() => setRejudgeModalOpen(false)}
          onRejudge={handleRejudgeProblem}
        />
      )}
    </div>
  );
};

export default AdminContestPage;
