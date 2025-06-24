// import StandingTable from "./StandingTable";
// import { Standing, Problem } from "../types";
// import api from "../../api";
// import { useEffect, useState } from "react";

// export const StandingPage = () => {
//   const [standings, setStandings] = useState<Standing[]>([]);
//   const [problems, setProblems] = useState<Problem[]>([]);

//   const fetchStandings = async () => {
//     try {
//       const res = await api.get("/contest/1/ranking");

//       setStandings(res.data.data.rankings);
//       setProblems(res.data.data.problems);
//     } catch (error) {
//       console.error("Failed to fetch standings", error);
//     }
//   };
//   useEffect(() => {
//     fetchStandings();
//   }, []);
//   return (
//     <div className="one-column-wrapper">
//       <StandingTable title="Standing" problems={problems} standings={standings} />
//     </div>
//   );
// };

// export default StandingPage;
