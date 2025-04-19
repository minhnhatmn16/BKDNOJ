import { Submission } from "./types";
import { Link } from "react-router-dom";

interface SubmissionTableProps {
  title: string;
  submissions: Submission[];
}

const SubmissionTable = ({ title, submissions }: SubmissionTableProps) => {
  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="bg-primary p-3 text-xl text-white">{title}</h4>
        <div className="table-responsive">
          <table className="min-w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-[10%] border border-gray-300 px-2 py-1 text-center">#</th>
                <th className="w-[10%] border border-gray-300 px-2 py-1 text-center">Result</th>
                <th className="w-[10%] border border-gray-300 px-2 py-1 text-center">When</th>
                <th className="w-[35%] border border-gray-300 px-2 py-1">Problem</th>
                <th className="w-[25%] border border-gray-300 px-2 py-1">User</th>
                <th className="w-[10%] border border-gray-300 px-2 py-1 text-center">Usage</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => (
                <tr key={sub.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="border border-gray-300 px-2 py-1 text-center">{sub.id}</td>
                  <td className={`border border-gray-300 px-2 py-1 text-center ${sub.colorClass}`}>
                    <div className="font-semibold">{sub.score}</div>
                    <div className="text-xs">
                      {sub.status} | {sub.language}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <div className="text-xs text-gray-500">{sub.date}</div>
                    <div className="font-medium">{sub.time}</div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <Link to={`/problem/${sub.id}`} className="text-blue-600 hover:underline">
                      {sub.problemTitle}
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{sub.user_name}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <div className="text-xs">{sub.execTime}</div>
                    <div className="text-xs">{sub.memory}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTable;
