import { Link } from "react-router-dom";
import { Check } from "lucide-react";

interface Judge {
  id: number;
  name: string;
  available: boolean;
  upTime: string;
  load: string;
  ping: string;
}

export const StatusPage = () => {
  const judges: Judge[] = [
    {
      id: 3,
      name: "kyuri",
      available: true,
      upTime: "5d, 13h, 19m, 12s",
      load: "0.00",
      ping: "1.46 ms"
    },
    {
      id: 2,
      name: "suika",
      available: true,
      upTime: "5d, 13h, 18m, 53s",
      load: "0.00",
      ping: "1.71 ms"
    }
  ];

  const runtimes = [
    "C",
    "C11",
    "C++03",
    "C++11",
    "C++14",
    "C++17",
    "C++20",
    "Java 8",
    "Pascal",
    "Python 3"
  ];

  return (
    <div className="one-column-wrapper">
      <div className="one-column-element">
        <div className="judge-table wrapper-vanilla">
          <h4 className="text-xl mb-3 font-bold">Judge Status</h4>
          <div className="table-responsive">
            <table className="rounded w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Available?</th>
                  <th className="p-3 border-b" style={{ minWidth: "100px" }}>Up Time</th>
                  <th className="p-3 border-b">Load</th>
                  <th className="p-3 border-b">Ping</th>
                </tr>
              </thead>
              <tbody>
                {judges.map((judge) => (
                  <tr key={judge.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b text-truncate" style={{ maxWidth: "100px" }}>
                      {judge.id}
                    </td>
                    <td className="p-3 border-b text-truncate" style={{ maxWidth: "300px" }}>
                      {judge.name}
                    </td>
                    <td className="p-3 border-b">
                      {judge.available && <Check className="text-accent" size={20} />}
                    </td>
                    <td className="p-3 border-b" style={{ minWidth: "100px" }}>
                      {judge.upTime}
                    </td>
                    <td className="p-3 border-b">{judge.load}</td>
                    <td className="p-3 border-b">{judge.ping}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <span className="classic-pagination block mt-3">
            Page:
            <ul className="inline-flex ml-2">
              <li className="mx-1"><span className="font-bold">[1]</span></li>
            </ul>
          </span>
          <div className="judge-table text-left mt-6">
            <h4 className="text-xl mb-3 font-bold">Available Runtime</h4>
            <ul className="m-1 pl-5 list-disc">
              {runtimes.map((runtime) => (
                <li key={runtime}>{runtime}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
