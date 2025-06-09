import { useEffect, useState } from "react";
import { Problem } from "../../types";
import api from "../../../api";
import CreateProblemModal from "./CreateProblemModal";
import UpdateProblemModal from "./UpdateProblemModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../../components/pagination/Pagination";

const AdminProblemPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleEditClick = async (problemId: number) => {
    try {
      const res = await api.get(`/admin/problem/${problemId}`);
      setSelectedProblem(res.data.data);
      setEditModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch problem details", err);
    }
  };

  const fetchProblems = async (page: number) => {
    try {
      const res = await api.get(`/admin/problem?page=${page}`);
      setProblems(res.data.data.problems);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching problems:", err);
    }
  };

  useEffect(() => {
    fetchProblems(currentPage);
  }, [currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`/admin/problem?page=${page}`);
  };

  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="flex items-center justify-between bg-primary p-3 text-xl text-white">
          <span>Manage Problems</span>
          <button
            onClick={() => setShowModal(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-2xl font-bold text-primary hover:bg-gray-100"
            title="Add Problem"
          >
            +
          </button>
        </h4>

        <div className="table-responsive">
          <table className="min-w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-center">ID</th>
                <th className="border p-3 text-center">Name</th>
                <th className="border p-3 text-center">Time Limit (ms)</th>
                <th className="border p-3 text-center">Memory Limit (KB)</th>
                <th className="border p-3 text-center">Visibility</th>
                <th className="border p-3 text-center">Testcase</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.problem_id} className="border-t">
                  <td className="border p-3 text-center">{problem.problem_id}</td>
                  <td className="border p-3 text-center">
                    <Link
                      to={`/problem/${problem.problem_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {problem.problem_name}
                    </Link>
                  </td>
                  <td className="border p-3 text-center">{problem.timelimit_ms}</td>
                  <td className="border p-3 text-center">{problem.memorylimit_kb}</td>
                  <td className="border p-3 text-center">
                    {problem.is_public ? "Public" : "Private"}
                  </td>
                  <td className="border p-3 text-center">
                    {problem.has_testcase ? <span className="text-green-500">&#10004;</span> : ""}
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleEditClick(problem.problem_id)}
                      className="text-blue-600 underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>

      <CreateProblemModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <UpdateProblemModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        problem={selectedProblem}
      />
    </div>
  );
};

export default AdminProblemPage;
