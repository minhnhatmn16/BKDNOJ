import { Standing, Problem } from "../types";
import { Link } from "react-router-dom";

interface StandingTableProps {
  title: string;
  problems: Problem[];
  standings: Standing[];
}

const StandingTable = ({ title, problems, standings }: StandingTableProps) => {
  const maxProblemCount = problems.length;

  const problemLabels = Array.from({ length: maxProblemCount }, (_, i) =>
    String.fromCharCode(65 + i),
  );

  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="bg-primary p-3 text-xl text-white">{title}</h4>
        <div className="table-responsive">
          <table className="w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-[5%] border border-gray-300 p-3 text-center">#</th>
                <th className="border border-gray-300 p-3 text-center">User</th>
                <th className="w-[7%] border border-gray-300 p-3 text-center">Point</th>
                {problemLabels.map((label, idx) => (
                  <th key={idx} className="w-[7%] border border-gray-300 p-3 text-center">
                    <Link
                      to={`/problem/${problems[idx].problem_id}`}
                      className="text-black hover:underline"
                    >
                      {label}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standings.map((standing, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-2 py-1">{standing.user_name}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <div className="font-medium">{standing.solved}</div>
                    <div className="text-xs text-gray-500">{standing.penalty}</div>
                  </td>
                  {Array.from({ length: maxProblemCount }, (_, idx) => {
                    const problem = problems[idx];
                    return (
                      <td key={idx} className="border border-gray-300 px-2 py-1 text-center">
                        {standing.listProblem[idx].firstACTime !== null ? (
                          <>
                            <div className="font-medium text-green-600">
                              +
                              {standing.listProblem[idx].wrongAttempts > 0 &&
                                ` ${standing.listProblem[idx].wrongAttempts}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {standing.listProblem[idx].firstACTime}
                            </div>
                          </>
                        ) : standing.listProblem[idx].wrongAttempts > 0 ? (
                          <div className="font-medium text-red-600">
                            - {standing.listProblem[idx].wrongAttempts}
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StandingTable;
