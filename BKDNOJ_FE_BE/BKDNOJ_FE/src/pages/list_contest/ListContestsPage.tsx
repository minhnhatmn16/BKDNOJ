import ContestTable from "./ListContestTable";
import { Contest, Problem } from "../types";
import api from "../../api";
import { useEffect, useState } from "react";
import JoinContestPasswordModal from "./JoinContestPasswordModal";
import { notifyError, notifySuccess } from "../../components/utils/ApiNotifier";

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

  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleJoinClick = (contestId: number) => {
    setSelectedContestId(contestId);
    setShowPasswordModal(true);
  };

  const handleSubmitPassword = async (password: string) => {
    if (!selectedContestId) return;
    try {
      await api.post(`/contest/${selectedContestId}/participants`, { password });
      notifySuccess("Joined contest successfully!");
      setShowPasswordModal(false);
      fetchProblems();
    } catch (error: any) {
      notifyError(error.response?.data?.message || "Failed to join contest");
      // console.error(error.response?.data?.message || "Failed to join contest.");
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
        onClickRegister={handleJoinClick}
      />
      <ContestTable
        isPast={true}
        title="Past Contests"
        list_contest={pastContests || []}
        showEmptyMessage
      />
      <JoinContestPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleSubmitPassword}
      />
    </div>
  );
};

export default ContestsPage;
