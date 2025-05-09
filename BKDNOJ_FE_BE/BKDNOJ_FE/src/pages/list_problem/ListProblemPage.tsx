import ProblemsTable from "./ListProblemTable";
import { Problem } from "../types";
import { useState } from "react";

export const ListProblemsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const listProlem: Problem[] = [
    {
      id: "1",
      solved: true,
      title: "Problem 1",
      acPercentage: 80,
      solved_count: 100,
      timeLimit: "3s",
      memoryLimit: "262144 KB",
    },
    {
      id: "2",
      solved: false,
      title: "Problem 2",
      acPercentage: 60,
      solved_count: 50,
      timeLimit: "3s",
      memoryLimit: "262144 KB",
    },
    {
      id: "3",
      solved: false,
      title: "Problem 3",
      acPercentage: 45,
      solved_count: 30,
      timeLimit: "3s",
      memoryLimit: "262144 KB",
    },
    {
      id: "4",
      solved: true,
      title: "Problem 4",
      acPercentage: 90,
      solved_count: 200,
      timeLimit: "3s",
      memoryLimit: "262144 KB",
    },
  ];

  return (
    <div className="one-column-wrapper">
      <ProblemsTable
        title="Problems"
        list_problem={listProlem}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ListProblemsPage;
