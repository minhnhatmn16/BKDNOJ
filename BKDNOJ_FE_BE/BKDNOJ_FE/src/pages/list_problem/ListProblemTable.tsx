import { Link, useNavigate } from "react-router-dom";
import { Problem } from "../types";
import GotoPageInput from "../../components/pagination/GotoPageInput";
import SubmitModal from "../submit/SubmitModal";
import { useState } from "react";
import api from "../../api";

interface ListProblemsTableProps {
  title: string;
  list_problem: Problem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
}

const ProblemsTable = ({
  title,
  list_problem,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
}: ListProblemsTableProps) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (problem_id: number, language: string, code: string) => {
    try {
      const res = await api.post(`/problem/${problem_id}/submit`, { language, code });
      navigate("/submissions");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">{error}</div>
      )}
      {/* Table section */}
      <div className="w-full lg:w-3/4">
        <div className="one-column-element mb-6">
          <div className="overflow-hidden rounded-md border border-gray-300">
            <h4 className="bg-primary p-3 text-xl text-white">{title}</h4>
            <div className="table-responsive">
              <table className="w-full table-fixed border-collapse border border-gray-300 text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-[7%] border border-gray-300 p-3 text-center">Status</th>
                    <th className="w-[10%] border border-gray-300 p-3 text-center">ID</th>
                    <th className="border border-gray-300 p-3">Name</th>
                    <th className="w-[7%] border border-gray-300 p-3 text-center"></th>
                    <th className="w-[10%] border border-gray-300 p-3 text-center">#AC</th>
                  </tr>
                </thead>
                <tbody>
                  {list_problem.map((problem, index) => (
                    <tr key={problem.problem_id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="border border-gray-300 p-3 text-center">
                        {problem.userStatus === "ac" ? (
                          <span className="text-green-500">&#10004;</span>
                        ) : problem.userStatus === "sub" ? (
                          <span className="text-red-500">&#10006;</span>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="border border-gray-300 p-3 text-center">{index + 1}</td>

                      <td className="border border-gray-300 p-3">
                        <Link
                          to={`/problem/${problem.problem_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {problem.problem_name}
                        </Link>
                      </td>

                      <td className="border border-gray-300 p-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedProblem(problem);
                            setShowModal(true);
                          }}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <img src="/submit.png" alt="Submit" className="h-5 w-5" />
                        </button>
                      </td>

                      <td className="border border-gray-300 p-3 text-center">
                        {problem.acceptedUserCount > 0 && (
                          <div className="flex items-center justify-center space-x-2">
                            <img src="/user-register.png" alt="User Icon" className="h-4 w-4" />
                            <span>x {problem.acceptedUserCount}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="justify-left flex items-center gap-2 bg-gray-100 p-4">
              <button
                className="rounded border px-3 py-1 disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2 ||
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  );
                })
                .reduce((acc: (number | "...")[], page, idx, arr) => {
                  if (idx > 0 && page !== arr[idx - 1] + 1) {
                    acc.push("...");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, index) =>
                  item === "..." ? (
                    <span key={`dots-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      className={`rounded border px-3 py-1 ${
                        currentPage === item ? "bg-blue-500 text-white" : ""
                      }`}
                      onClick={() => onPageChange(item as number)}
                    >
                      {item}
                    </button>
                  ),
                )}

              <button
                className="rounded border px-3 py-1 disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search box */}
      <div className="w-full lg:w-1/4">
        <div className="rounded-md border border-gray-300 bg-white p-4">
          <h4 className="mb-3 text-lg font-semibold">Filter Problems</h4>
          <input
            type="text"
            placeholder="Search problem..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mb-2 w-full rounded border p-2"
          />
          <div className="flex flex-col space-y-1">
            <label>
              <input type="checkbox" /> Hide solved problems
            </label>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => {
                onSearch(searchText);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      {selectedProblem && (
        <SubmitModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedProblem(null);
          }}
          onSubmit={handleSubmit}
          problem={selectedProblem}
        />
      )}
    </div>
  );
};

export default ProblemsTable;
