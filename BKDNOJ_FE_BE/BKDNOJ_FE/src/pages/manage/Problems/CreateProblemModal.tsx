import { useState, useEffect } from "react";
import api from "../../../api";
import { notifyError, notifySuccess } from "../../../components/utils/ApiNotifier";
import LoadingOverlay from "../../../components/utils/LoadingOverlay";

interface CreateProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProblemModal = ({ isOpen, onClose }: CreateProblemModalProps) => {
  const [problemName, setProblemName] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [timeLimit, setTimeLimit] = useState<number>(1);
  const [memoryLimit, setMemoryLimit] = useState<number>(256);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProblemName("");
      setPdfFile(null);
      setZipFile(null);
      setIsPublic(false);
      setTimeLimit(1);
      setMemoryLimit(256);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!problemName.trim()) {
      notifyError("Problem name is required.");
      return;
    }

    if (Number(timeLimit) <= 0) {
      notifyError("Time limit must be greater than 0.");
      return;
    }

    if (Number(memoryLimit) <= 0) {
      notifyError("Memory limit must be greater than 0.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("problem_name", problemName);
      if (pdfFile) {
        formData.append("file", pdfFile);
      }
      if (zipFile) {
        formData.append("zip_testcase", zipFile);
      }
      formData.append("is_public", String(isPublic));
      formData.append("timelimit_ms", String(timeLimit));
      formData.append("memorylimit_kb", String(memoryLimit));

      await api.post("/admin/problem", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      notifySuccess("Problem created successfully!");
      onClose();
      window.location.reload();
    } catch (err: any) {
      setLoading(false);
      notifyError(err.response?.data?.message || "Failed to create problem");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-xl rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-bold">Create Problem</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Problem Name</label>
            <input
              type="text"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              className="col-span-2 w-full rounded border p-2"
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type === "application/pdf") {
                  setPdfFile(file);
                } else {
                  alert("Please select a valid PDF file.");
                }
              }}
              className="col-span-2 w-full"
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Test case</label>
            <input
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.name.toLowerCase().endsWith(".zip")) {
                  setZipFile(file);
                } else {
                  alert("Please select a valid ZIP file.");
                  e.target.value = ""; // reset input
                  setZipFile(null);
                }
              }}
              className="col-span-2 w-full"
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Time Limit (ms)</label>
            <input
              type="number"
              min={1}
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="col-span-2 w-full rounded border p-2"
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Memory Limit (MB)</label>
            <input
              type="number"
              min={1}
              value={memoryLimit}
              onChange={(e) => setMemoryLimit(Number(e.target.value))}
              className="col-span-2 w-full rounded border p-2"
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Visibility</label>
            <div className="col-span-2 flex gap-4">
              {["Public", "Private"].map((v) => {
                const selected = v === "Public" ? isPublic : !isPublic;
                return (
                  <button
                    key={v}
                    className={`rounded border px-3 py-1 ${
                      selected ? "bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => setIsPublic(v === "Public")}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded bg-gray-300 px-4 py-2">
            Cancel
          </button>
          <button onClick={handleSubmit} className="rounded bg-blue-600 px-4 py-2 text-white">
            Confirm
          </button>
        </div>
      </div>
      {loading && <LoadingOverlay message="Creating problem..." />}
    </div>
  );
};

export default CreateProblemModal;
