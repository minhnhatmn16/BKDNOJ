import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Problem } from "../types";
import api from "../../api";

interface SubmitPageProps {
  problem: Problem;
}

const SubmitPage = ({ problem }: SubmitPageProps) => {
  const [language, setLanguage] = useState("C++17");
  const [code, setCode] = useState("// Write your code here");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!problem?.problem_id) {
      console.error("Missing problem_id");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/problem/${problem.problem_id}/submit`, {
        language,
        code,
      });
      navigate("/submissions");
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-3xl rounded-md border border-gray-200 bg-white shadow-lg">
        {/* <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-2">
          <h2 className="text-lg font-semibold">Submit Solution</h2>
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">
            &larr; Go Back
          </button>
        </div> */}
        <div className="p-4">
          {/* {problem && (
            <div className="mb-4 flex items-center gap-2">
              <label className="mb-1 block font-medium text-gray-700">Problem:</label>
              <div className="mb-1 block font-semibold text-gray-800">{problem.problem_name}</div>
            </div>
          )} */}

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

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`rounded px-4 py-2 text-white ${
                submitting ? "bg-gray-400" : "bg-primary hover:bg-blue-700"
              }`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;
