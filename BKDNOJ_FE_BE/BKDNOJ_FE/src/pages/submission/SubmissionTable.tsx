import { Submission } from "../types";
import { Link } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";

interface SubmissionTableProps {
  title: string;
  submissions: Submission[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSubmissionClick: (submissionId: number) => void;
  currentUserId: number;
  contest_id?: number;
}

const SubmissionTable = ({
  title,
  submissions,
  currentPage,
  totalPages,
  onPageChange,
  onSubmissionClick,
  currentUserId,
  contest_id,
}: SubmissionTableProps) => {
  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="bg-primary p-3 text-xl text-white">{title}</h4>
        <div className="table-responsive">
          <table className="min-w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-[10%] border border-gray-300 px-2 py-1 text-center">#</th>
                <th className="w-[10%] border border-gray-300 px-2 py-1 text-center">Result</th>
                <th className="w-[10%] border border-gray-300 px-2 py-1 text-center">When</th>
                <th className="w-[35%] border border-gray-300 px-2 py-1">Problem</th>
                <th className="w-[25%] border border-gray-300 px-2 py-1">User</th>
                <th className="w-[10%] border border-gray-300 px-2 py-1 text-center">Usage</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => (
                <tr key={sub.submission_id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {sub.user_id === currentUserId ? (
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => onSubmissionClick(sub.submission_id)}
                      >
                        {sub.submission_id.toString().padStart(6, "0")}
                      </button>
                    ) : (
                      <span>{sub.submission_id.toString().padStart(6, "0")}</span>
                    )}
                  </td>

                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {sub.status === "Pending" ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-1 flex items-center justify-center">
                          <svg
                            className="h-4 w-4 animate-spin text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-md px-1 py-1 text-sm font-semibold ${
                          sub.status === "AC"
                            ? "bg-green-400 text-green-900"
                            : sub.status === "WA"
                              ? "bg-gray-300 text-red-600"
                              : "bg-gray-200 text-black"
                        }`}
                      >
                        <div>
                          {sub.passed_test} / {sub.total_test}
                        </div>
                        <div className="text-xs font-normal">
                          {sub.status} | {sub.language == "cpp" ? "C++" : "Python"}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <div className="text-xs text-gray-500">
                      {new Date(sub.submit_time).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                    <div className="font-medium">
                      {new Date(sub.submit_time).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <Link
                      to={
                        contest_id
                          ? `/contest/${contest_id}/problem/${sub.Problem.problem_id}`
                          : `/problem/${sub.Problem.problem_id}`
                      }
                      className="text-blue-600 hover:underline"
                    >
                      {sub.Problem.problem_name}
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{sub.User.user_name}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {sub.status === "Pending" ? (
                      <div className="text-sm text-gray-500">---</div>
                    ) : (
                      <>
                        <div className="text-xs">{sub.time_ms}s</div>
                        <div className="text-xs">{sub.memory_kb}MB</div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default SubmissionTable;
