import React from "react";
import { Submission } from "../../pages/types";

interface SubmissionDetailModalProps {
  submission: Submission | null;
  onClose: () => void;
}

const SubmissionDetailModal = ({ submission, onClose }: SubmissionDetailModalProps) => {
  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-md bg-white p-4"
        onClick={(e) => e.stopPropagation()} // ngăn không cho click đóng modal khi click bên trong
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-600 hover:text-black"
          aria-label="Close modal"
        >
          ✕
        </button>
        <h3 className="mb-4 text-xl font-semibold">
          Submission #{submission.submission_id.toString().padStart(6, "0")}
        </h3>
        <p>
          <strong>Result:</strong> {submission.status}
        </p>
        <p>
          <strong>Language:</strong> {submission.language}
        </p>
        <p>
          <strong>Passed Tests:</strong> {submission.passed_test}
        </p>
        <p>
          <strong>Submitted At:</strong> {new Date(submission.submit_time).toLocaleString()}
        </p>
        <p>
          <strong>Problem:</strong> {submission.Problem.problem_name}
        </p>
        <p>
          <strong>User:</strong> {submission.User.user_name}
        </p>
        <p>
          <strong>Time:</strong> {submission.time_ms}s
        </p>
        <p>
          <strong>Memory:</strong> {submission.memory_kb}MB
        </p>

        {/* Nếu có code submission thì show thêm ở đây, giả sử có submission.code */}
        {submission.code && (
          <pre className="mt-4 max-h-64 overflow-x-auto rounded bg-gray-100 p-2">
            <code>{submission.code}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetailModal;
