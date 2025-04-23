import ContestTable from "./ListContestTable";
import { Contest, Problem } from "../types";

export const ContestsPage = () => {
  const upcomingContests: Contest[] = [
    {
      id: "bkdniwf",
      name: "BKDN ICPC World Finals Congratulations Challenge",
      date: "3/22/2025, 12:30:00 PM",
      duration: "04:00:00",
      participants: 135,
      isPast: false,
      isUserRegistered: false,
      listProblem: [
        {
          id: "001",
          solved: false,
          title: "Bai 1",
          acPercentage: 0,
          solved_count: 0,
          timeLimit: "1s",
          memoryLimit: "262144 KB",
          pdfUrl: "./public/file_PDF/thongbao.pdf",
        },
      ],
    },
  ];

  const pastContests: Contest[] = [
    {
      id: "bkdniwf",
      name: "BKDN ICPC World Finals Congratulations Challenge",
      date: "3/22/2025, 12:30:00 PM",
      duration: "04:00:00",
      participants: 135,
      isPast: false,
      isUserRegistered: true,
      listProblem: [
        {
          id: "001",
          solved: false,
          title: "Bai 1",
          acPercentage: 0,
          solved_count: 0,
          timeLimit: "1s",
          memoryLimit: "262144 KB",
          pdfUrl: "./public/file_PDF/thongbao.pdf",
        },
      ],
    },
  ];

  return (
    <div className="one-column-wrapper">
      <ContestTable
        title="Ongoing/Upcoming Contests"
        list_contest={upcomingContests}
        showEmptyMessage
      />
      <ContestTable title="Past Contests" list_contest={pastContests} showEmptyMessage />
    </div>
  );
};

export default ContestsPage;
