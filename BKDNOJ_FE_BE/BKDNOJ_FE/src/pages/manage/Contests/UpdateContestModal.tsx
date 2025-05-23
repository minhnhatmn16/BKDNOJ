import { useState, useEffect } from "react";
import { Problem, Contest } from "../../types";
import api from "../../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
interface UpdateContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  contest: Contest | null;
}

const UpdateContestModal = ({ isOpen, onClose, onUpdate, contest }: UpdateContestModalProps) => {
  const [title, setTitle] = useState(contest?.contest_name || "");
  const [startTime, setStartTime] = useState<Date | null>(
    contest ? new Date(contest.start_time) : null,
  );
  const [duration, setDuration] = useState(contest?.duration.toString() || "");
  const [rankRule, setRankRule] = useState<"ICPC" | "IOI">(
    contest?.format === "IOI" ? "IOI" : "ICPC",
  );

  const [isPublic, setIsPublic] = useState(contest?.is_public ?? true);
  const [password, setPassword] = useState(contest?.password || "");
  //   const [selectedProblems, setSelectedProblems] = useState<number[]>(contest?.problem_ids || []);

  useEffect(() => {
    if (contest) {
      setTitle(contest.contest_name);
      setStartTime(new Date(contest.start_time));
      setDuration(contest.duration.toString());
      if (contest.format === "ICPC" || contest.format === "IOI") {
        setRankRule(contest.format);
      }
      setIsPublic(contest.is_public);
      setPassword(contest.password || "");
      //   setSelectedProblems(contest.problem_ids || []);
    }
  }, [contest]);

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
      await api.put(`/admin/contest/${contest?.contest_id}`, {
        contest_name: title,
        start_time: format(startTime!, "yyyy-MM-dd HH:mm:ss"),
        duration: Number(duration),
        rank_rule: rankRule,
        is_public: isPublic,
        password: isPublic ? null : password,
        // problem_ids: selectedProblems,
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!isOpen || !contest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-3xl rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-bold">Update Contest</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-2 w-full rounded border p-2"
            />
          </div>

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

          <div className="grid grid-cols-3 items-center">
            <label className="pr-4 text-right">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="col-span-2 w-full rounded border p-2"
            />
          </div>

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

          {/* <div className="grid grid-cols-3 items-start">
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
          </div> */}
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
export default UpdateContestModal;
