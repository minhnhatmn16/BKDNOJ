// import { Link } from "react-router-dom";

// interface Contest {
//   id: string;
//   name: string;
//   date: string;
//   duration: string;
//   participants: number;
// }

// export const ContestsPage = () => {
//   const upcomingContests: Contest[] = [];

//   const pastContests: Contest[] = [
//     {
//       id: "bkdniwf",
//       name: "BKDN ICPC World Finals Congratulations Challenge",
//       date: "3/22/2025, 12:30:00 PM",
//       duration: "04:00:00",
//       participants: 135
//     },
//     {
//       id: "bkdnoj2025_11",
//       name: "BKDNOJ 2025 - Contest 11",
//       date: "3/9/2025, 12:30:00 PM",
//       duration: "02:30:00",
//       participants: 30
//     },
//     {
//       id: "bkdnoj2024_10",
//       name: "BKDNOJ 2024 - Goodbye 2024",
//       date: "12/28/2024, 12:30:00 PM",
//       duration: "02:30:00",
//       participants: 154
//     },
//     {
//       id: "ltlqd01",
//       name: "LTLQD01",
//       date: "10/26/2024, 3:28:00 PM",
//       duration: "240:00:00",
//       participants: 79
//     },
//     {
//       id: "testability_ptc",
//       name: "Test Ability - [ProTech CLub]",
//       date: "11/1/2024, 2:00:00 PM",
//       duration: "48:00:00",
//       participants: 15
//     }
//   ];

//   return (
//     <div className="one-column-wrapper">
//       <div className="one-column-element mb-6">
//         <div className="border border-gray-300 rounded-md overflow-hidden">
//           <h4 className="bg-primary text-white p-3 text-xl">Ongoing/Upcoming Contests</h4>
//           <div className="table-responsive">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3 border-b">#</th>
//                   <th className="p-3 border-b">Name</th>
//                   <th className="p-3 border-b">When</th>
//                   <th className="p-3 border-b">Duration</th>
//                   <th className="p-3 border-b">Participate</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {upcomingContests.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="p-3 text-center">No contest planned yet.</td>
//                   </tr>
//                 ) : (
//                   upcomingContests.map((contest, index) => (
//                     <tr key={contest.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//                       <td className="p-3 border-b">{index + 1}</td>
//                       <td className="p-3 border-b">
//                         <Link to={`/contest/${contest.id}`} className="text-blue-600 hover:underline">
//                           {contest.name}
//                         </Link>
//                       </td>
//                       <td className="p-3 border-b">{contest.date}</td>
//                       <td className="p-3 border-b">{contest.duration}</td>
//                       <td className="p-3 border-b">
//                         <div className="flex items-center">
//                           <span>Participants: {contest.participants}</span>
//                           <Link to={`/contest/${contest.id}/standing`} className="ml-2 text-blue-600 hover:underline">
//                             Standing {'>>'}
//                           </Link>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <div className="one-column-element">
//         <div className="border border-gray-300 rounded-md overflow-hidden">
//           <h4 className="bg-primary text-white p-3 text-xl">Past Contests</h4>
//           <div className="table-responsive">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3 border-b">#</th>
//                   <th className="p-3 border-b">Name</th>
//                   <th className="p-3 border-b">When</th>
//                   <th className="p-3 border-b">Duration</th>
//                   <th className="p-3 border-b">Participate</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pastContests.map((contest, index) => (
//                   <tr key={contest.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//                     <td className="p-3 border-b">
//                       <Link to={`/contest/${contest.id}`} className="text-blue-600 hover:underline">
//                         {contest.id}
//                       </Link>
//                     </td>
//                     <td className="p-3 border-b">
//                       <Link to={`/contest/${contest.id}`} className="text-blue-600 hover:underline">
//                         {contest.name}
//                       </Link>
//                     </td>
//                     <td className="p-3 border-b">{contest.date}</td>
//                     <td className="p-3 border-b">{contest.duration}</td>
//                     <td className="p-3 border-b">
//                       <div className="flex items-center">
//                         <span>Participants: {contest.participants}</span>
//                         <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                           <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
//                         </svg>
//                         <Link to={`/contest/${contest.id}/standing`} className="ml-2 text-blue-600 hover:underline">
//                           Standing {'>>'}
//                         </Link>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="p-3 border-t flex justify-center">
//             <span className="classic-pagination">
//               Page:
//               <ul className="inline-flex ml-2">
//                 <li className="mx-1"><span className="font-bold">[1]</span></li>
//               </ul>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContestsPage;

import ContestTable from "./ContestTable";
import { Contest } from "./types";

export const ContestsPage = () => {
  const upcomingContests: Contest[] = [
    {
      id: "bkdniwf",
      name: "BKDN ICPC World Finals Congratulations Challenge",
      date: "3/22/2025, 12:30:00 PM",
      duration: "04:00:00",
      participants: 135,
      isPast: false,
      isUserRegistered: false,
    },
  ];

  const pastContests: Contest[] = [
    {
      id: "bkdniwf",
      name: "BKDN ICPC World Finals Congratulations Challenge",
      date: "3/22/2025, 12:30:00 PM",
      duration: "04:00:00",
      participants: 135,
      isPast: true,
      isUserRegistered: true,
    },
  ];

  return (
    <div className="one-column-wrapper">
      <ContestTable
        title="Ongoing/Upcoming Contests"
        contests={upcomingContests}
        showEmptyMessage
      />
      <ContestTable title="Past Contests" contests={pastContests} showEmptyMessage />
    </div>
  );
};

export default ContestsPage;
