import { useEffect, useState } from "react";
import api from "../../api";
import SimpleModal from "./SimpleModal";
import { notifyError, notifySuccess } from "../../components/utils/ApiNotifier";
import { ClipboardCopy } from "lucide-react";
import LoadingOverlay from "../../components/utils/LoadingOverlay";

interface Props {
  open: boolean;
  onClose: () => void;
  submissionId: number | null;
}

const SubmissionCodeModal = ({ open, onClose, submissionId }: Props) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
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
        setCode(res.data.data.code);
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
          <h2 className="text-xl font-bold">Submission #{submissionId}</h2>
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

        {error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          <div className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-4 font-mono text-sm">
            {code}
          </div>
        )}
      </div>
    </SimpleModal>
  );
};

export default SubmissionCodeModal;
