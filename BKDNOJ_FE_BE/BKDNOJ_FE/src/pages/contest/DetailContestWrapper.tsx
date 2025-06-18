import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../../api";
import { Contest } from "../types";
import DetailContest from "./DetailContest";
import { notifyError, notifySuccess } from "../../components/utils/ApiNotifier";

const DetailContestWrapper = () => {
  const { contest_id, tab: rawTab, problem_id } = useParams();
  const navigate = useNavigate();
  const [detailContest, setDetailContest] = useState<Contest>();

  const fetchContest = useCallback(async () => {
    try {
      const res = await api.get(`/contest/${contest_id}`);
      setDetailContest(res.data.data);
    } catch (error: any) {
      console.error("Failed to fetch contest:", error);
      const message =
        error.response?.data?.error || error.message || "Unable to load contest information.";
      notifyError(`${message}`);
      navigate("/contests");
    }
  }, [contest_id]);

  useEffect(() => {
    fetchContest();
  }, [fetchContest]);

  useEffect(() => {
    const validTabs = ["problems", "mysubmissions", "status", "standing"];
    if (!(contest_id && problem_id) && !validTabs.includes(rawTab || "")) {
      navigate(`/contest/${contest_id}/problems`, { replace: true });
    }
  }, [rawTab, contest_id, navigate, problem_id]);

  const tab = problem_id
    ? "detailproblem"
    : (rawTab as "problems" | "mysubmissions" | "status" | "standing");

  return detailContest ? (
    <DetailContest
      title="Contest"
      detail_contest={detailContest}
      activeTab={tab as "problems" | "mysubmissions" | "status" | "standing" | "detailproblem"}
      selectedProblemId={problem_id}
    />
  ) : (
    <div>Loading contest...</div>
  );
};

export default DetailContestWrapper;
