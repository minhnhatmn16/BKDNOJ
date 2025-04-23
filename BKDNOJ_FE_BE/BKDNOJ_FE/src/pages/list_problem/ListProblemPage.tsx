import ProblemsTable from "./ListProblemTable";
import { Problem } from "../types";

export const ListProblemsPage = () => {
  const listProlem: Problem[] = [
    {
      id: "1",
      solved: true,
      title: "Problem 1",
      acPercentage: 80,
      solved_count: 100,
      timeLimit: "3s",
      memoryLimit: "262144 KB",
    },
    {
      id: "2",
      solved: false,
      title: "Problem 2",
      acPercentage: 60,
      solved_count: 50,
      timeLimit: "3s",
      memoryLimit: "262144 KB",
    },
  ];

  return (
    <div className="one-column-wrapper">
      <ProblemsTable title="List Problem" list_problem={listProlem} />
    </div>
  );
};

export default ListProblemsPage;
