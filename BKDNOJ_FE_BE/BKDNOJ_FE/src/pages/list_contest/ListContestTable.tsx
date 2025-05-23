import { Link } from "react-router-dom";
import { Contest } from "../types";

interface ListContestTableProps {
  isPast: boolean;
  title: string;
  list_contest: Contest[];
  showEmptyMessage?: boolean;
}

const ListContestTable = ({
  isPast,
  title,
  list_contest,
  showEmptyMessage = false,
}: ListContestTableProps) => {
  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="bg-primary p-3 text-xl text-white">{title}</h4>
        <div className="table-responsive">
          <table className="w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-[5%] border border-gray-300 p-3 text-center">#</th>
                <th className="w-[40%] border border-gray-300 p-3 text-center">Name</th>
                <th className="w-[20%] border border-gray-300 p-3 text-center">Start</th>
                <th className="w-[10%] border border-gray-300 p-3 text-center">Length</th>
                <th className="w-[10%] border border-gray-300 p-3 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {list_contest.length === 0 ? (
                showEmptyMessage ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-gray-300 p-3 text-center text-gray-500"
                    >
                      No contest planned yet.
                    </td>
                  </tr>
                ) : null
              ) : (
                list_contest.map((contest, index) => (
                  <tr key={contest.contest_id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="border border-gray-300 p-3 text-center">{contest.contest_id}</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <Link
                        to={`/contest/${contest.contest_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contest.contest_name}
                      </Link>
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      {new Date(contest.start_time).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      <br />
                      {new Date(contest.start_time).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </td>

                    <td className="border border-gray-300 p-3 text-center">
                      {Math.floor(contest.duration / 60)
                        .toString()
                        .padStart(2, "0")}
                      :{(contest.duration % 60).toString().padStart(2, "0")}
                    </td>

                    <td className="border border-gray-300 p-3 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-2">
                          <img src="user-register.png" alt="User Icon" className="h-4 w-4" />
                          <span> x {contest.participantCount}</span>
                        </div>
                        {isPast ? (
                          <Link
                            to={`/contest/${contest.contest_id}/standing`}
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Standing &gt;&gt;
                          </Link>
                        ) : contest.isRegistered ? (
                          <Link
                            to={`/contest/${contest.contest_id}/standing`}
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Standing &gt;&gt;
                          </Link>
                        ) : (
                          <Link
                            to={`/contest/${contest.contest_id}/register`}
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Register &gt;&gt;
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListContestTable;
