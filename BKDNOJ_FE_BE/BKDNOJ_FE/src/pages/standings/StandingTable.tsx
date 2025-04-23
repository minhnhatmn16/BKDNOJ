import { Standing } from "../types";

interface StandingTableProps {
  title: string;
  standings: Standing[];
}

const StandingTable = ({ title, standings }: StandingTableProps) => {
  const maxProblemCount = Math.max(...standings.map((s) => s.problems.length));

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
                <th className="w-[5%] border border-gray-300 p-3 text-center">Rank</th>
                <th className="w-[10%] border border-gray-300 p-3 text-center">User</th>
                <th className="w-[10%] border border-gray-300 p-3 text-center">Point</th>
                {problemLabels.map((label, idx) => (
                  <th key={idx} className="w-[3%] border border-gray-300 p-3 text-center">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standings.map((standing, index) => (
                <tr key={standing.rank} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="border border-gray-300 p-3 text-center">{standing.rank}</td>
                  <td className="border border-gray-300 px-2 py-1">{standing.user}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <div className="font-medium">{standing.point}</div>
                    <div className="text-xs text-gray-500">{standing.penalty}</div>
                  </td>
                  {Array.from({ length: maxProblemCount }, (_, idx) => {
                    const problem = standing.problems[idx];
                    return (
                      <td key={idx} className="border border-gray-300 px-2 py-1 text-center">
                        {problem ? (
                          <>
                            <div className="font-medium">{problem.point}</div>
                            <div className="text-xs text-gray-500">{problem.time}</div>
                          </>
                        ) : (
                          "-"
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
