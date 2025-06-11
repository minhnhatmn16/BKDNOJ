import { useEffect, useState } from "react";
import api from "../../api";
import SimpleModal from "./SimpleModal";
import { notifyError, notifySuccess } from "../../components/utils/ApiNotifier";
import { ClipboardCopy } from "lucide-react";
import LoadingOverlay from "../../components/utils/LoadingOverlay";
import { Submission } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  submissionId: number | null;
}

const SubmissionCodeModal = ({ open, onClose, submissionId }: Props) => {
  const [submission, setSubmission] = useState<Submission>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(submission?.code || "");
      notifySuccess("Copied to clipboard!");
    } catch (e) {
      notifyError("Failed to copy.");
    }
  };

  useEffect(() => {
    const fetchCode = async () => {
      if (submissionId === null) return;

      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/submissions/${submissionId}`);
        setSubmission(res.data.data);
      } catch (err) {
        console.error("Failed to fetch submission code", err);
        const message = "Failed to load submission code. Please try again later.";
        notifyError(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchCode();
  }, [open, submissionId]);

  return (
    <SimpleModal open={open} onClose={onClose}>
      <div className="relative">
        {loading && <LoadingOverlay message="Loading source code..." />}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Submission #{(submissionId || 0).toString().padStart(6, "0")}
          </h2>

          {!loading && !error && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
              title="Copy to clipboard"
            >
              <ClipboardCopy size={16} />
              Copy
            </button>
          )}
        </div>

        {!error && (
          <p className="mt-1 text-sm text-gray-600">
            By <span className="font-medium">{submission?.User.user_name}</span>, problem:{" "}
            {submission?.Problem.problem_name},{" "}
            {submission?.status === "AC" ? (
              <span className="font-medium text-green-600">{submission.status}</span>
            ) : (
              <span className="font-medium">{submission?.status}</span>
            )}
          </p>
        )}

        {error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          <div className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-4 font-mono text-sm">
            {submission?.code}
          </div>
        )}
      </div>
    </SimpleModal>
  );
};

export default SubmissionCodeModal;
