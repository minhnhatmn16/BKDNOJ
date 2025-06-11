import { ContestProblem } from "../../types";
import { RefreshCw, X } from "lucide-react";

interface ProblemRejudgeModalProps {
  problems: ContestProblem[];
  onClose: () => void;
  onRejudge: (contestProblemId: number) => void;
}

const ProblemRejudgeModal = ({ problems, onClose, onRejudge }: ProblemRejudgeModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl rounded bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Rejudge Problems</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto rounded border">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p) => (
                <tr key={p.problem_id}>
                  <td className="border px-4 py-2">{p.Problem.problem_name}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => onRejudge(p.contest_problem_id)}
                      title="Rejudge this problem"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <RefreshCw className="inline h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {problems.length === 0 && (
                <tr>
                  <td colSpan={3} className="border px-4 py-2 text-center text-gray-500">
                    No problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemRejudgeModal;
