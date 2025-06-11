import { useEffect, useState } from "react";
import { Problem, Submission } from "../types";
import api from "../../api";
import SubmissionTable from "../submission/SubmissionTable";
import SubmitPage from "../submit/SubmitPage";
import PdfViewer from "../../components/utils/PdfViewer";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import SubmissionCodeModal from "../submission/SubmissionCodeModal";

interface DetailProblemProps {
  title: string;
  detail_problem: Problem;
}
const getDirectDriveLink = (link: string): string => {
  const match = link.match(/\/d\/(.+?)\//);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : link;
};
const DetailProblem = ({ title, detail_problem }: DetailProblemProps) => {
  return (
    <div className="one-column-element mb-6">
      <h4 className="p-3 text-center text-2xl font-bold text-primary">
        {detail_problem.problem_name}
      </h4>
      <div className="flex flex-col p-4 text-center">
        <h1 className="space-y-1 text-center text-sm text-gray-500">
          <strong>Time limit:</strong> {(parseFloat(detail_problem.timelimit_ms) / 1000).toFixed(2)}{" "}
          s
        </h1>

        <h1 className="space-y-1 text-center text-sm text-gray-500">
          <strong>Memory limit:</strong> {detail_problem.memorylimit_kb} MB
        </h1>
      </div>

      <div className="mt-4">
        {detail_problem.link && <PdfViewer pdfUrl={getDirectDriveLink(detail_problem.link)} />}
      </div>
    </div>
  );
};

export default DetailProblem;
