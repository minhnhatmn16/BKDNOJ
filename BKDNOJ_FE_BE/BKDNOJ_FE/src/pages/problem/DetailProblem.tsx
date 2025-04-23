import { Problem } from "../types";
import PdfViewer from "./PdfViewer";
interface DetailProblemProps {
  title: string;
  detail_problem: Problem;
}

const DetailProblem = ({ title, detail_problem }: DetailProblemProps) => {
  return (
    <div className="one-column-element mb-6">
      <div className="mb-4 overflow-hidden rounded-md border border-gray-300">
        <div className="flex flex-col p-4 text-center">
          <h1 className="ml-4 text-2xl font-bold">{detail_problem.title}</h1>
          <h1 className="ml-4 text-base">Time Limit per test: {detail_problem.timeLimit}</h1>
          <h1 className="ml-4 text-base">Memory Limit per test: {detail_problem.memoryLimit}</h1>
          <PdfViewer pdfUrl={detail_problem.pdfUrl} />
        </div>
      </div>
    </div>
  );
};

export default DetailProblem;
