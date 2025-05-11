import SubmissionTable from "./SubmissionTable";
import { Submission } from "../types";
import api from "../../api";
import { useEffect, useState } from "react";

export const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get("/contest/1/submissions");
      console.log(res);
      setSubmissions(res.data.data);
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    }
  };
  useEffect(() => {
    fetchSubmissions();
  }, []);
  return (
    <div className="one-column-wrapper">
      <SubmissionTable title="Submissions" submissions={submissions} />
    </div>
  );
};

export default SubmissionsPage;
