import { Problem } from "../types";
import DetailProblem from "./DetailProblem";
import { useEffect, useState, useCallback } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";

export const DetailProblemPage = () => {
  const { problem_id, contest_id } = useParams();

  const [detailProblem, setDetailProblem] = useState<Problem>();
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const endpoint = contest_id
          ? `/contest/${contest_id}/problem/${problem_id}`
          : `/problem/${problem_id}`;
        console.log(endpoint);
        const res = await api.get(endpoint);
        console.log(res.data.data);
        setDetailProblem(res.data.data.problem);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      }
    };
    fetchProblem();
  }, [contest_id, problem_id]);

  return (
    <div className="one-column-wrapper">
      {detailProblem ? (
        <DetailProblem title="Past Contests" detail_problem={detailProblem} />
      ) : (
        <div>Loading contest...</div>
      )}
    </div>
  );
};

export default DetailProblemPage;
