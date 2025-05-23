import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api";
import { Problem } from "../../types";

const AdminProblemPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get("/admin/problems");
        setProblems(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="flex items-center justify-between bg-primary p-3 text-xl text-white">
          <span>Manage Problems</span>
          <Link
            to="/admin/problems/create"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-2xl font-bold text-primary hover:bg-gray-100"
            title="Add Problem"
          >
            +
          </Link>
        </h4>

        <div className="table-responsive">
          <table className="min-w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">ID</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.problem_id} className="border-t">
                  <td className="border p-3">{problem.problem_id}</td>
                  <td className="border p-3">{problem.problem_name}</td>
                  <td className="space-x-2 border p-3">
                    <Link
                      to={`/admin/problems/${problem.problem_id}/edit`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>
                    {/* <button className="text-red-600" onClick={() => {}}>
                      Delete
                    </button> */}
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

export default AdminProblemPage;
