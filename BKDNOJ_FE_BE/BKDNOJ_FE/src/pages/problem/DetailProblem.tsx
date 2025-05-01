import { useState } from "react";
import PdfViewer from "./PdfViewer";
import SubmitModal from "./SubmitModal";
import { Problem } from "../types";

interface DetailProblemProps {
  title: string;
  detail_problem: Problem;
}

const DetailProblem = ({ title, detail_problem }: DetailProblemProps) => {
  const [showModal, setShowModal] = useState(false);
  const handleSubmit = (language: string, code: string) => {
    console.log("Submitting code in", language);
    console.log("Code:", code);
    setShowModal(false);
  };

  return (
    <div className="one-column-element mb-6">
      <div className="mb-4 overflow-hidden rounded-md border border-gray-300">
        <div className="flex flex-col p-4 text-center">
          <h1 className="ml-4 text-2xl font-bold">{detail_problem.title}</h1>
          <h1 className="ml-4 text-base">Time Limit per test: {detail_problem.timeLimit}</h1>
          <h1 className="ml-4 text-base">Memory Limit per test: {detail_problem.memoryLimit}</h1>
          <div className="flex px-4 text-left">
            <button
              // className="ml-auto rounded-md border border-gray-300 px-4 py-1 font-semibold text-black transition hover:bg-blue-50"
              className="ml-auto rounded bg-primary px-4 py-2 text-white hover:bg-blue-700"
              onClick={() => setShowModal(true)}
            >
              Submit
            </button>
            <SubmitModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSubmit={handleSubmit}
            />
          </div>

          <PdfViewer pdfUrl={detail_problem.pdfUrl} />
        </div>
      </div>
    </div>
  );
};

export default DetailProblem;
