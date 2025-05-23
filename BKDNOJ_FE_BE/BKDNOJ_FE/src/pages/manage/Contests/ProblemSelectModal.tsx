import { Problem } from "../../types";

interface ProblemSelectModalProps {
  problems: Problem[];
  selected: number[];
  onToggle: (id: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const ProblemSelectModal = ({
  problems,
  selected,
  onToggle,
  onCancel,
  onConfirm,
}: ProblemSelectModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold">Select Problems</h3>
        <div className="max-h-96 overflow-y-auto rounded border">
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                {/* <th className="border px-4 py-2">Created At</th> */}
                <th className="border px-4 py-2">Select</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p) => (
                <tr key={p.problem_id}>
                  <td className="border px-4 py-2">{p.problem_id}</td>
                  <td className="border px-4 py-2">{p.problem_name}</td>
                  {/* <td className="border px-4 py-2">{p.created_at ?? "N/A"}</td> */}
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.problem_id)}
                      onChange={() => onToggle(p.problem_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded bg-gray-300 px-4 py-2">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded bg-blue-600 px-4 py-2 text-white">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemSelectModal;
