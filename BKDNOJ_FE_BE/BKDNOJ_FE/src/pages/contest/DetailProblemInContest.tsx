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
    } catch (err: any) {
      if (err.response?.data?.message) {
        notifyError(err.response.data.message);
      } else {
        notifyError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="one-column-element mb-6">
      <h4 className="p-3 text-center text-2xl font-bold text-primary">
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

      <div className="mb-4 text-center">
        <button
          onClick={() => setShowModal((prev) => !prev)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {showModal ? "Hide Submit" : "Submit Solution"}
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
  );
};

export default DetailProblem;
