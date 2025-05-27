import { useState, useEffect } from "react";
import { Problem, Contest } from "../../types";
import api from "../../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import ProblemSelectModal from "./ProblemSelectModal";
import PasswordInput from "../../../components/utils/PasswordInput";

interface UpdateContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  contest: Contest | null;
}

const UpdateContestModal = ({ isOpen, onClose, contest }: UpdateContestModalProps) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState("");
  const [rankRule, setRankRule] = useState<"ICPC" | "IOI">("ICPC");
  const [penalty, setPenalty] = useState<number>(20);
  const [isPublic, setIsPublic] = useState(false);
  const [password, setPassword] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
  const [problemScores, setProblemScores] = useState<Record<number, number>>({});

  const [showProblemTable, setShowProblemTable] = useState(false);
  const [tempSelectedProblems, setTempSelectedProblems] = useState<number[]>([]);

  const fetchProblems = async () => {
    try {
      const res = await api.get("/admin/problem");
      setProblems(res.data.data);
    } catch (err) {
      console.error("Failed to load problems", err);
    }
  };

  const toggleTempProblem = (problemId: number) => {
    setTempSelectedProblems((prev) =>
      prev.includes(problemId) ? prev.filter((id) => id !== problemId) : [...prev, problemId],
    );
  };

  const confirmSelectedProblems = () => {
    setSelectedProblems(tempSelectedProblems);
    if (rankRule === "IOI") {
      const newScores: Record<number, number> = {};
      tempSelectedProblems.forEach((pid) => {
        newScores[pid] = problemScores[pid] ?? 100;
      });
      setProblemScores(newScores);
    }
    setShowProblemTable(false);
  };

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
      const ids = contest.Contest_Problems?.map((cp) => cp.problem_id) || [];
      setSelectedProblems(ids);
      fetchProblems();
    }
  }, [contest]);

  useEffect(() => {
    if (showProblemTable) fetchProblems();
  }, [showProblemTable]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title contest is required.");
      return;
    }

    if (Number(duration) <= 0) {
      alert("Duration must be greater than 0.");
      return;
    }

    if (!isPublic) {
      if (!password.trim()) {
        alert("Password is required.");
        return;
      }
      const isValid = /^[a-zA-Z0-9]*$/.test(password);
      if (!isValid) {
        alert("Password can only contain letters and numbers (a-z, A-Z, 0-9).");
        return;
      }
    }

    if (rankRule === "ICPC" && Number(penalty) < 0) {
      alert("Penalty must be 0 or greater.");
      return;
    }

    if (rankRule === "IOI") {
      for (const id of selectedProblems) {
        const score = problemScores[id];
        if (typeof score !== "number" || score < 10) {
          alert(`Each problem in IOI mode must be greater than 0.`);
          return;
        }
      }
    }

    try {
      await api.put(`/admin/contest/${contest?.contest_id}`, {
        contest_name: title,
        start_time: format(startTime!, "yyyy-MM-dd HH:mm:ss"),
        duration: Number(duration),
        rank_rule: rankRule,
        is_public: isPublic,
        password: isPublic ? null : password,
        problem_ids: selectedProblems,
      });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!isOpen || !contest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-40">
      <div className="w-full max-w-3xl rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-bold">Update Contest</h2>
        <div className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center">
            <label className="pr-4 text-right">Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 w-full rounded border p-2"
            />
          </div>

          {/* Begin Time */}
          <div className="grid grid-cols-4 items-center">
            <label className="pr-4 text-right">Begin Time (UTC+7)</label>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              dateFormat="dd-MM-yyyy HH:mm:ss"
              className="col-span-3 w-full rounded border p-2"
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-4 items-center">
            <label className="pr-4 text-right">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="col-span-3 w-full rounded border p-2"
            />
          </div>

          {/* Rank Rule */}
          <div className="grid grid-cols-4 items-center">
            <label className="pr-4 text-right">Rank Rule</label>
            <div className="col-span-3 flex gap-4">
              {["IOI", "ICPC"].map((rule) => (
                <button
                  key={rule}
                  className={`rounded border px-3 py-1 ${rankRule === rule ? "bg-blue-500 text-white" : ""}`}
                  onClick={() => setRankRule(rule as "ICPC" | "IOI")}
                >
                  {rule}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="grid grid-cols-4 items-center">
            <label className="pr-4 text-right">Visibility</label>
            <div className="col-span-3 flex gap-4">
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

          {/** Dòng: Password (cho phép nhập khi là Private) */}
          <div className="grid grid-cols-4 items-center">
            <label className="pr-4 text-right">Password</label>
            <div className="col-span-3">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter contest password"
                disabled={isPublic}
              />
            </div>
          </div>

          {/* Problems */}
          <div className="grid grid-cols-4 items-start">
            <label className="pr-4 pt-2 text-right">Select Problems</label>
            <div className="col-span-3 space-y-2">
              <button
                className="mb-2 rounded border bg-blue-500 px-3 py-1 text-white"
                onClick={() => {
                  setTempSelectedProblems(selectedProblems);
                  setShowProblemTable(true);
                }}
              >
                Edit Problems
              </button>

              <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                {selectedProblems.map((id, index) => {
                  const problem = problems.find((p) => p.problem_id === id);
                  const letter = String.fromCharCode(65 + index);

                  const moveUp = () => {
                    if (index === 0) return;
                    const newList = [...selectedProblems];
                    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
                    setSelectedProblems(newList);
                  };

                  const moveDown = () => {
                    if (index === selectedProblems.length - 1) return;
                    const newList = [...selectedProblems];
                    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
                    setSelectedProblems(newList);
                  };

                  const remove = () => {
                    setSelectedProblems(selectedProblems.filter((pid) => pid !== id));
                  };

                  return (
                    <div key={id} className="flex items-center justify-between rounded border p-2">
                      <div>
                        <span className="font-medium">{letter}. </span>
                        <span>{problem?.problem_name || "Unknown Problem"}</span>
                        {rankRule === "IOI" && (
                          <div className="mt-1 text-sm text-gray-700">
                            <label className="mr-2">Score:</label>
                            <input
                              type="number"
                              min={1}
                              className="w-20 rounded border px-1 py-0.5"
                              value={problemScores[id] ?? 100}
                              onChange={(e) =>
                                setProblemScores({ ...problemScores, [id]: Number(e.target.value) })
                              }
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={moveUp}
                          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                        >
                          ↑
                        </button>
                        <button
                          onClick={moveDown}
                          className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                        >
                          ↓
                        </button>
                        <button
                          onClick={remove}
                          className="rounded bg-red-400 px-2 py-1 text-white hover:bg-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded bg-gray-300 px-4 py-2">
            Cancel
          </button>
          <button onClick={handleSubmit} className="rounded bg-blue-600 px-4 py-2 text-white">
            Confirm
          </button>
        </div>

        {/* Problem Selector Modal */}
        {showProblemTable && (
          <ProblemSelectModal
            problems={problems}
            selected={tempSelectedProblems}
            onToggle={toggleTempProblem}
            onCancel={() => setShowProblemTable(false)}
            onConfirm={confirmSelectedProblems}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateContestModal;
