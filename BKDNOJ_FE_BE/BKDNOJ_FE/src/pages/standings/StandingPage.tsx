import StandingTable from "./StandingTable";
import { Standing } from "../types";

const standings: Standing[] = [
  {
    rank: 1,
    user: "Minh Nhat",
    point: "100",
    penalty: "01:03:30",
    problems: [
      {
        point: "100",
        time: "19:02:17",
      },
    ],
  },
  {
    rank: 2,
    user: "Xuan Toan",
    point: "100",
    penalty: "01:03:30",
    problems: [
      {
        point: "100",
        time: "19:02:17",
      },
      {
        point: "100",
        time: "19:02:17",
      },
      {
        point: "100",
        time: "19:02:17",
      },
      {
        point: "100",
        time: "19:02:17",
      },
      {
        point: "100",
        time: "19:02:17",
      },
      {
        point: "100",
        time: "19:02:17",
      },
      {
        point: "100",
        time: "19:02:17",
      },
    ],
  },
];

export const StandingPage = () => {
  return (
    <div className="one-column-wrapper">
      <StandingTable title="Standing" standings={standings} />
    </div>
  );
};

export default StandingPage;
