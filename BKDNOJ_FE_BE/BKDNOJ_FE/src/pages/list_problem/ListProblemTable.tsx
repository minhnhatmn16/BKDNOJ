import { Link } from "react-router-dom";
import { Problem } from "../types";

interface ListProblemsTableProps {
  title: string;
  list_problem: Problem[];
}

const ListProblemsTable = ({ title, list_problem }: ListProblemsTableProps) => {
  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="bg-primary p-3 text-xl text-white">{title}</h4>
        <div className="table-responsive">
          <table className="w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-[5%] border border-gray-300 p-3 text-center">Status</th>
                <th className="w-[10%] border border-gray-300 p-3">ID</th>
                <th className="w-[30%] border border-gray-300 p-3">Name</th>
                <th className="w-[15%] border border-gray-300 p-3 text-center">%AC</th>
                <th className="w-[15%] border border-gray-300 p-3 text-center">#AC</th>
              </tr>
            </thead>
            <tbody>
              {list_problem.map((problem, index) => (
                <tr key={problem.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="border border-gray-300 p-3 text-center">
                    {problem.solved ? <span className="text-green-500">&#10004;</span> : ""}
                  </td>
                  <td className="border border-gray-300 p-3">{index + 1}</td>
                  <td className="border border-gray-300 p-3">
                    <Link
                      // to={`/detailproblem/${problem.id}`}
                      to={`/detailproblem`}
                      className="text-blue-600 hover:underline"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {problem.solved_count}%
                  </td>
                  <td className="border border-gray-300 p-3 text-center">{problem.acPercentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListProblemsTable;
