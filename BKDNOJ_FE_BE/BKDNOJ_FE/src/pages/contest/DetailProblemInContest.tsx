import { useState } from "react";
import { Problem, ContestProblem } from "../types";
import PdfViewer from "../../components/utils/PdfViewer";
import { notifyError, notifySuccess } from "../../components/utils/ApiNotifier";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import SubmitModal from "../submit/SubmitModal";

interface DetailProblemProps {
  title: string;
  contest_id: number;
  detail_problem: ContestProblem;
}

const getDirectDriveLink = (link: string): string => {
  const match = link.match(/\/d\/(.+?)\//);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : link;
};

const DetailProblem = ({ title, detail_problem, contest_id }: DetailProblemProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ContestProblem | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (problem_id: number, language: string, code: string) => {
    try {
      const res = await api.post(`/contest/${contest_id}/${problem_id}`, { language, code });
      navigate(`/contest/${contest_id}/mysubmissions`);
      window.location.reload();
    } catch (error: any) {
      console.error("Submission failed:", error);
      const message = error.response?.data?.error || error.message || "Submission failed.";
      notifyError(`${message}`);
    }
  };

  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="p-3 text-center text-2xl font-bold text-primary">
          {String.fromCharCode(64 + parseInt(detail_problem.order))}.{" "}
          {detail_problem.Problem.problem_name}
        </h4>

        <div className="flex flex-col p-4 text-center">
          <h1 className="text-sm text-gray-500">
            <strong>Time limit:</strong>{" "}
            {(parseFloat(detail_problem.Problem.timelimit_ms) / 1000).toFixed(2)} s
          </h1>
          <h1 className="text-sm text-gray-500">
            <strong>Memory limit:</strong> {detail_problem.Problem.memorylimit_kb} MB
          </h1>
        </div>

        <div className="mb-4 flex justify-end pr-6">
          <button
            onClick={() => setShowModal((prev) => !prev)}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-blue-700"
          >
            <img src="/submit.png" alt="Submit" className="h-5 w-5" />
            {"Submit"}
          </button>
        </div>

        <div className="mt-4">
          {detail_problem.Problem.link && (
            <PdfViewer pdfUrl={getDirectDriveLink(detail_problem.Problem.link)} />
          )}
        </div>

        {showModal && (
          <SubmitModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedProblem(null);
            }}
            onSubmit={handleSubmit}
            problem={detail_problem.Problem}
          />
        )}
      </div>
    </div>
  );
};

export default DetailProblem;
