import { useState, useEffect } from "react";
import { Problem } from "../../types";
import api from "../../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

interface CreateContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const CreateContestModal = ({ isOpen, onClose, onCreate }: CreateContestModalProps) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState("");
  const [rankRule, setRankRule] = useState<"ICPC" | "IOI">("ICPC");
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get("/admin/problem");
        setProblems(res.data.data);
      } catch (err) {
        console.error("Failed to load problems", err);
      }
    };
    if (isOpen) fetchProblems();
  }, [isOpen]);

  const toggleProblem = (problemId: number) => {
    setSelectedProblems((prev) =>
      prev.includes(problemId) ? prev.filter((id) => id !== problemId) : [...prev, problemId],
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title contest is required.");
      return;
    }

    if (Number(duration) <= 0) {
      alert("Duration must be greater than 0.");
      return;
    }

    if (isPublic && !password.trim()) {
      alert("Password is required.");
      return;
    }

    try {
      await api.post("/admin/contest", {
        contest_name: title,
        start_time: format(startTime!, "yyyy-MM-dd HH:mm:ss"),
        duration: Number(duration),
        rank_rule: rankRule,
        is_public: isPublic,
        password: isPublic ? null : password,
        problem_ids: selectedProblems,
      });
      onCreate();
      onClose();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-3xl rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-bold">Create Contest</h2>
        <div className="space-y-4">
          {/** Dòng: Title */}
          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-2 w-full rounded border p-2"
            />
          </div>

          {/** Dòng: Begin Time */}
          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Begin Time (UTC+7)</label>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              dateFormat="dd-MM-yyyy HH:mm:ss"
              className="col-span-2 w-full rounded border p-2"
            />
          </div>

          {/** Dòng: Duration */}
          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="col-span-2 w-full rounded border p-2"
            />
          </div>

          {/** Dòng: Rank Rule */}
          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Rank Rule</label>
            <div className="col-span-2 flex gap-4">
              {["ICPC", "IOI"].map((rule) => (
                <button
                  key={rule}
                  className={`rounded border px-3 py-1 ${
                    rankRule === rule ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => setRankRule(rule as "ICPC" | "IOI")}
                >
                  {rule}
                </button>
              ))}
            </div>
          </div>

          {/** Dòng: Visibility */}
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

          {/** Dòng: Password (chỉ hiện nếu Private) */}
          {!isPublic && (
            <div className="grid grid-cols-3 items-center">
              <label className="pr-4 text-right">Password</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-2 w-full rounded border p-2"
              />
            </div>
          )}

          {/** Dòng: Select Problems */}
          <div className="grid grid-cols-3 items-start">
            <label className="pr-4 pt-2 text-right">Select Problems</label>
            <div className="col-span-2 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto">
              {problems.map((p, index) => {
                const letter = String.fromCharCode(65 + index);
                return (
                  <label key={p.problem_id} className="flex items-center gap-2 rounded border p-2">
                    <input
                      type="checkbox"
                      checked={selectedProblems.includes(p.problem_id)}
                      onChange={() => toggleProblem(p.problem_id)}
                    />
                    {letter}. {p.problem_name}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/** Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded bg-gray-300 px-4 py-2">
            Cancel
          </button>
          <button onClick={handleSubmit} className="rounded bg-blue-600 px-4 py-2 text-white">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContestModal;
