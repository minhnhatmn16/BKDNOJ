import { Link } from "react-router-dom";
import { Contest } from "../types";

interface ListContestTableProps {
  title: string;
  list_contest: Contest[];
  showEmptyMessage?: boolean;
}

const ListContestTable = ({
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
                <th className="w-[20%] border border-gray-300 p-3 text-center">When</th>
                <th className="w-[15%] border border-gray-300 p-3 text-center">Duration</th>
                <th className="w-[20%] border border-gray-300 p-3 text-center">Participate</th>
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
                  <tr key={contest.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <Link to={`/contest/${contest.id}`} className="text-blue-600 hover:underline">
                        {contest.name}
                      </Link>
                    </td>
                    <td className="border border-gray-300 p-3 text-center">{contest.date}</td>
                    <td className="border border-gray-300 p-3 text-center">{contest.duration}</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-2">
                          <img src="public\user-register.png" alt="User Icon" className="h-4 w-4" />
                          <span> x 135</span>
                        </div>
                        {contest.isPast ? (
                          <Link
                            to={`/contest/${contest.id}/standing`}
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Standing
                          </Link>
                        ) : contest.isUserRegistered ? (
                          <Link
                            to={`/contest/${contest.id}/standing`}
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Standing &gt;&gt;
                          </Link>
                        ) : (
                          <Link
                            to={`/contest/${contest.id}/register`}
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
