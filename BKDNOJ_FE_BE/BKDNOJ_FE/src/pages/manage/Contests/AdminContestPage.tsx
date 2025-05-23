import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api";
import { Contest } from "../../types";
import CreateContestModal from "./CreateContestModal";
import UpdateContestModal from "./UpdateContestModal";

const AdminContestPage = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await api.get("/admin/contest");
        setContests(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContests();
  }, []);

  return (
    <div className="one-column-element mb-6">
      <div className="overflow-hidden rounded-md border border-gray-300">
        <h4 className="flex items-center justify-between bg-primary p-3 text-xl text-white">
          <span>Manage Contests</span>
          <Link
            to="#"
            onClick={() => setShowModal(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-2xl font-bold text-primary hover:bg-gray-100"
            title="Add Contest"
          >
            +
          </Link>
        </h4>

        <div className="table-responsive">
          <table className="min-w-full table-fixed border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-center">Name</th>
                <th className="border p-3 text-center">Start Time</th>
                <th className="border p-3 text-center">Duration</th>
                <th className="border p-3 text-center">Status</th>
                <th className="border p-3 text-center">Participants</th>
                <th className="border p-3 text-center">Visibility</th>
                <th className="border p-3 text-center">Format</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => {
                const start = new Date(contest.start_time);
                const end = new Date(start.getTime() + contest.duration * 60000);
                const now = new Date();

                let status = "Upcoming";
                if (now >= end) status = "Ended";
                else if (now >= start && now < end) status = "Running";

                return (
                  <tr key={contest.contest_id} className="border-t">
                    <td className="border p-3 text-center">{contest.contest_name}</td>
                    <td className="border p-3 text-center">{start.toLocaleString()}</td>
                    <td className="border p-3 text-center">{contest.duration} minutes</td>
                    <td className="border p-3 text-center">{status}</td>
                    <td className="border p-3 text-center">{contest.participantCount ?? 0}</td>
                    <td className="border p-3 text-center">
                      {contest.is_public ? "Public" : "Private"}
                    </td>
                    <td className="border p-3 text-center">{contest.format}</td>
                    <td className="space-x-2 border p-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedContest(contest);
                          setEditModalOpen(true);
                        }}
                        className="text-blue-600 underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <CreateContestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={() => {
          api.get("/admin/contests").then((res) => setContests(res.data.data));
        }}
      />
      <UpdateContestModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={() => {
          api.put("/admin/contest").then((res) => setContests(res.data.data));
        }}
        contest={selectedContest}
      />
    </div>
  );
};

export default AdminContestPage;
