import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Problem } from "../types";
import api from "../../api";
import { notifyError, notifySuccess } from "../../components/utils/ApiNotifier";

interface SubmitPageProps {
  problem: Problem;
}

const SubmitPage = ({ problem }: SubmitPageProps) => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!problem?.problem_id) {
      notifyError("Missing problem_id");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/problem/${problem.problem_id}/submit`, {
        language,
        code,
      });
      notifySuccess("Submitted successfully!");
      navigate("/submissions");
    } catch (error: any) {
      console.error("Submission failed:", error);
      if (error.response?.status === 503) {
        notifyError("Saved, but judge server is offline.");
      } else {
        notifyError("Submission failed.");
      }
    }
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-3xl rounded-md border border-gray-200 bg-white shadow-lg">
        <div className="p-4">
          <div className="mb-4">
            <label className="mb-1 block font-medium">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1"
            >
              <option value="cpp">C++</option>
              <option value="py">Python</option>
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
