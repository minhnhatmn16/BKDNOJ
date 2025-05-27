import SubmissionTable from "./SubmissionTable";
import { Submission } from "../types";
import api from "../../api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const SubmissionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubmissions = async (page: number) => {
    try {
      const res = await api.get(`/submissions?page=${page}`);

      setSubmissions(res.data.data.submissions);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    }
  };

  useEffect(() => {
    fetchSubmissions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`/submissions?page=${page}`);
  };

  return (
    <div className="one-column-wrapper">
      <SubmissionTable
        title="Submissions"
        submissions={submissions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SubmissionsPage;
