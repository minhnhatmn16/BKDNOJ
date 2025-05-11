import ContestTable from "./ListContestTable";
import { Contest, Problem } from "../types";
import api from "../../api";
import { useEffect, useState } from "react";

export const ContestsPage = () => {
  const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
  const [pastContests, setPastContests] = useState<Contest[]>([]);
  const fetchProblems = async () => {
    try {
      const res = await api.get(`/contests`);

      setUpcomingContests(res.data.data.upcomingContests);
      setPastContests(res.data.data.pastContests);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    }
  };
  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="one-column-wrapper">
      <ContestTable
        isPast={false}
        title="Ongoing/Upcoming Contests"
        list_contest={upcomingContests || []}
        showEmptyMessage
      />
      <ContestTable
        isPast={true}
        title="Past Contests"
        list_contest={pastContests || []}
        showEmptyMessage
      />
    </div>
  );
};

export default ContestsPage;
