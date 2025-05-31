import { Link, useNavigate } from "react-router-dom";
import { Problem } from "../types";
import Pagination from "../../components/pagination/Pagination";
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
  onToggleHideSolved: (hide: boolean) => void;
  hideSolved: boolean;
}

const ProblemsTable = ({
  title,
  list_problem,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onToggleHideSolved,
  hideSolved,
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
                      <td className="border border-gray-300 p-3 text-center">
                        {problem.problem_id}
                      </td>

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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
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
              <input
                type="checkbox"
                checked={hideSolved}
                onChange={(e) => onToggleHideSolved(e.target.checked)}
              />{" "}
              Hide solved problems
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
