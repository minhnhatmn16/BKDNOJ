import { Contest } from "../types";
import DetailContest from "./DetailContest";
import { useCallback, useEffect, useState } from "react";
import api from "../../api";
import { useParams, Outlet } from "react-router-dom";

export const DetailContestPage = () => {
  const { id } = useParams();

  const [detailContest, setDetailContest] = useState<Contest>();

  const fetchProblems = useCallback(async () => {
    try {
      const res = await api.get(`/contest/${id}`);
      setDetailContest(res.data.data);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    }
  }, [id]);
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return (
    <div className="one-column-wrapper">
      {detailContest ? (
        <DetailContest title="Past Contests" detail_contest={detailContest} />
      ) : (
        <div>Loading contest...</div>
      )}
    </div>
  );
};

export default DetailContestPage;
