import SubmissionTable from "./SubmissionTable";
import { Submission } from "../types";
import api from "../../api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubmissionCodeModal from "./SubmissionCodeModal";

export const SubmissionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [user_id, setUserId] = useState<number>();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [viewingId, setViewingId] = useState<number | null>(null);

  const fetchSubmissions = async (page: number) => {
    try {
      const res = await api.get(`/submissions?page=${page}`);

      setSubmissions(res.data.data.submissions);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    }
  };

  const fetchMyProfile = async () => {
    try {
      const res = await api.get(`/auth/profile`);
      setUserId(res.data.data.profile.user_id);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };
  useEffect(() => {
    fetchSubmissions(currentPage);
    fetchMyProfile();
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
        onSubmissionClick={(id) => setViewingId(id)}
        currentUserId={user_id || -1}
      />
      <SubmissionCodeModal
        open={viewingId !== null}
        submissionId={viewingId}
        onClose={() => setViewingId(null)}
      />
    </div>
  );
};

export default SubmissionsPage;
