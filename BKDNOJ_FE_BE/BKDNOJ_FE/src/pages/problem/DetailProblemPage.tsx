import { Problem } from "../types";
import DetailProblem from "./DetailProblem";

export const DetailProblemPage = () => {
  const detailproblem: Problem = {
    id: "1",
    solved: true,
    title: "Problem 1",
    acPercentage: 80,
    solved_count: 100,
    timeLimit: "3s",
    memoryLimit: "262144 KB",
    pdfUrl: "/file_PDF/thongbao.pdf",
  };

  return (
    <div className="one-column-wrapper">
      <DetailProblem title="Past Contests" detail_problem={detailproblem} />
    </div>
  );
};

export default DetailProblemPage;
