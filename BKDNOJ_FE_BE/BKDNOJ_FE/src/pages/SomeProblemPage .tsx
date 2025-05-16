import { useState } from "react";
import SubmitModal from "./SubmitModal";

const SomeProblemPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (language: string, code: string) => {
    setShowModal(false);
  };
  const problemTitle = "Problem XYZ";
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl">Problem XYZ</h1>
      <button
        onClick={() => setShowModal(true)}
        className="rounded bg-primary px-4 py-2 text-white"
      >
        Open Submit Form
      </button>

      <SubmitModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        problemTitle={problemTitle}
      />
    </div>
  );
};

export default SomeProblemPage;
