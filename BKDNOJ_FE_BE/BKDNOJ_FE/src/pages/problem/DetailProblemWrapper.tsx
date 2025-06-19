import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../../api";
import { Problem } from "../types";
import DetailProblem from "./DetailProblem";
import { notifyError, notifySuccess } from "../../components/utils/ApiNotifier";

const DetailContestWrapper = () => {
  const { problem_id, tab } = useParams();
  const navigate = useNavigate();
  const [detailProblem, setDetailProblem] = useState<Problem>();

  const fetchProblem = useCallback(async () => {
    try {
      const res = await api.get(`/problem/${problem_id}`);
      setDetailProblem(res.data.data);
    } catch (error: any) {
      console.error("Problem failed:", error);
      const message = error.response?.data?.error || error.message || "Problem not found.";
      notifyError(`${message}`);
      navigate(`/problems`);
    }
  }, [problem_id]);

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  useEffect(() => {
    if (!["problem", "submit", "mysubmissions", "status"].includes(tab || "")) {
      navigate(`/problem/${problem_id}`, { replace: true });
    }
  }, [tab, problem_id, navigate]);

  return detailProblem ? (
    <DetailProblem
      title="Contest"
      detail_problem={detailProblem}
      activeTab={tab === "submit" || tab === "mysubmissions" || tab === "status" ? tab : "problem"}
    />
  ) : (
    <div>Loading problem...</div>
  );
};

export default DetailContestWrapper;
