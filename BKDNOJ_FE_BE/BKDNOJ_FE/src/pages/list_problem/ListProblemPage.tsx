import ProblemsTable from "./ListProblemTable";
import { Problem } from "../types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";

export const ListProblemsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [listProblem, setListProblem] = useState<Problem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const fetchProblems = async (page: number, query = "") => {
    try {
      const url = query
        ? `/problems?page=${page}&search=${encodeURIComponent(query)}`
        : `/problems?page=${page}`;

      const res = await api.get(url);
      setListProblem(res.data.data.problems);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    }
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search") || "";
    setSearchTerm(search);
  }, [location.search]);

  useEffect(() => {
    fetchProblems(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    navigate(`/problems?search=${encodeURIComponent(term)}`);
  };
  return (
    <div className="one-column-wrapper">
      <ProblemsTable
        title="Problems"
        list_problem={listProblem || []}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ListProblemsPage;
