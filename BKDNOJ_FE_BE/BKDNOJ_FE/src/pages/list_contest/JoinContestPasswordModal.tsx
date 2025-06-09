import { useState } from "react";

interface JoinContestPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

const JoinContestPasswordModal = ({ isOpen, onClose, onSubmit }: JoinContestPasswordModalProps) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-lg font-bold">Enter Contest Password</h2>
        <input
          type="password"
          className="mb-4 w-full rounded border px-3 py-2"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded bg-gray-300 px-4 py-2">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(password)}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinContestPasswordModal;
