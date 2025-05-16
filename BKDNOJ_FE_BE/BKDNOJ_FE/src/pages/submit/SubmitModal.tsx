import { useState } from "react";
import { Problem } from "../types";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSubmit: (language: string, code: string, file?: File | null) => void;
  onSubmit: (problem_id: number, language: string, code: string) => void;
  problem: Problem | null;
}

const SubmitModal = ({ isOpen, onClose, onSubmit, problem }: SubmitModalProps) => {
  const [language, setLanguage] = useState("C++17");
  const [code, setCode] = useState("// Write your code here");
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen || !problem) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-3xl rounded-md bg-white shadow-lg">
        <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-2">
          <h2 className="text-lg font-semibold">Submit</h2>
          <button onClick={onClose} className="text-xl font-bold text-gray-600 hover:text-black">
            &times;
          </button>
        </div>
        <div className="p-4">
          {problem?.problem_name && (
            <div className="mb-4 flex items-center gap-2">
              <label className="mb-1 block font-medium text-gray-700">Problem:</label>
              <div className="mb-1 block font-semibold text-gray-800">{problem.problem_name}</div>
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 block font-medium">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1"
            >
              <option value="C++">C++</option>
              <option value="Python">Python</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1 block font-medium">Code:</label>
            <textarea
              rows={15}
              className="w-full rounded border border-gray-300 p-2 font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          {/* <div className="mb-4">
            <label className="mb-1 block font-medium">Attach File (Optional):</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full rounded border border-gray-300 px-2 py-1"
            />
          </div> */}
          {problem?.problem_name && (
            <div className="flex justify-end space-x-3">
              <button onClick={onClose} className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
                Close
              </button>
              <button
                onClick={() => onSubmit(problem.problem_id, language, code)}
                className="rounded bg-primary px-4 py-2 text-white hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
