import ProblemsTable from "./ProblemTable";
import { Problem } from "./types";

export const ProblemsPage = () => {
  const listProlem: Problem[] = [
    {
      id: "1",
      solved: true,
      title: "Problem 1",
      acPercentage: 80,
      solved_count: 100,
    },
    {
      id: "2",
      solved: false,
      title: "Problem 2",
      acPercentage: 60,
      solved_count: 50,
    },
  ];

  return (
    <div className="one-column-wrapper">
      <ProblemsTable title="List Problem" problems={listProlem} />
    </div>
  );
};

export default ProblemsPage;
