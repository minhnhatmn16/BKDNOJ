import { Link, useNavigate } from "react-router-dom";
import { ContestProblem } from "../types";
import GotoPageInput from "../../components/pagination/GotoPageInput";
import SubmitModal from "../submit/SubmitModal";
import { useState } from "react";
import api from "../../api";

interface ListProblemsTableProps {
  title: string;
  contest_id: number;
  list_problem: ContestProblem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProblemsTable = ({
  title,
  contest_id,
  list_problem,
  currentPage,
  totalPages,
  onPageChange,
}: ListProblemsTableProps) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [selectedProblem, setSelectedProblem] = useState<ContestProblem | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (problem_id: number, language: string, code: string) => {
    try {
      const res = await api.post(`/contest/${contest_id}/${problem_id}`, { language, code });
      navigate(`/contest/${contest_id}/mysubmissions`);
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
                  {list_problem.map((contestProblem, index) => (
                    <tr
                      key={contestProblem.problem_id}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="border border-gray-300 p-3 text-center">
                        {contestProblem.Problem.userStatus === "ac" ? (
                          <span className="text-green-500">&#10004;</span>
                        ) : contestProblem.Problem.userStatus === "sub" ? (
                          <span className="text-red-500">&#10006;</span>
                        ) : (
                          ""
                        )}
                      </td>

                      <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                      <td className="border border-gray-300 p-3">
                        <Link
                          to={`/problem/${contestProblem.problem_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contestProblem.Problem.problem_name}
                        </Link>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedProblem(contestProblem);
                            setShowModal(true);
                          }}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <img src="/submit.png" alt="Submit" className="h-5 w-5" />
                        </button>
                      </td>

                      <td className="border border-gray-300 p-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <img src="/user-register.png" alt="User Icon" className="h-4 w-4" />
                          <span>x {contestProblem.Problem.acceptedUserCount}</span>
                        </div>
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

      {selectedProblem && (
        <SubmitModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedProblem(null);
          }}
          onSubmit={handleSubmit}
          problem={selectedProblem.Problem}
        />
      )}
    </div>
  );
};

export default ProblemsTable;
