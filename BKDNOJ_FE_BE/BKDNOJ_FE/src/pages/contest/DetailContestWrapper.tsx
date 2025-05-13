import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../../api";
import { Contest } from "../types";
import DetailContest from "./DetailContest";

const DetailContestWrapper = () => {
  const { contest_id, tab } = useParams();
  const navigate = useNavigate();
  const [detailContest, setDetailContest] = useState<Contest>();

  const fetchContest = useCallback(async () => {
    try {
      const res = await api.get(`/contest/${contest_id}`);
      setDetailContest(res.data.data);
    } catch (error) {
      console.error("Failed to fetch contest:", error);
    }
  }, [contest_id]);

  useEffect(() => {
    fetchContest();
  }, [fetchContest]);

  useEffect(() => {
    if (!["problems", "mysubmissions", "status", "standing"].includes(tab || "")) {
      navigate(`/contest/${contest_id}/problems`, { replace: true });
    }
  }, [tab, contest_id, navigate]);

  return detailContest ? (
    <DetailContest
      title="Contest"
      detail_contest={detailContest}
      activeTab={tab as "problems" | "mysubmissions" | "status" | "standing"}
    />
  ) : (
    <div>Loading contest...</div>
  );
};

export default DetailContestWrapper;
