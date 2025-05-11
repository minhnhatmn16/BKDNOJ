import ProblemsTable from "./ListProblemTable";
import { Problem } from "../types";
import { useEffect, useState } from "react";
import api from "../../api";

export const ListProblemsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [listProblem, setListProblem] = useState<Problem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProblems = async (page: number) => {
    try {
      const res = await api.get(`/problems`);

      setListProblem(res.data.data.problems);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    }
  };
  useEffect(() => {
    fetchProblems(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="one-column-wrapper">
      <ProblemsTable
        title="Problems"
        list_problem={listProblem || []}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ListProblemsPage;
