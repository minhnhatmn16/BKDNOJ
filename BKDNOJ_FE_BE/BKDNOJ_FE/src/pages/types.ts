export interface Contest {
  contest_id: number;
  contest_name: string;
  start_time: string;
  duration: number;
  participantCount: number;
  isRegistered: boolean;
  Contest_Problems: ContestProblem[];
}
export interface User {
  user_id: number;
  user_name: string;
  email: string;
  avatar: string;
  role: string;
  can_create_contest: boolean;
}
export interface ContestProblem {
  order: string;
  point: number;
  problem_id: number;
  Problem: Problem;
}

export interface Problem {
  problem_id: string;
  solved: boolean;
  problem_name: string;
  acPercentage: number;
  solved_count: number;
  timelimit_ms: string;
  memorylimit_kb: string;
  link?: string;
}

export interface Submission {
  submission_id: number;
  user_id: number;
  language: string;
  status: string;
  total_test: number;
  passed_test: number;
  time_ms: number;
  memory_kb: number;
  submit_time: string;
  User: User;
  Problem: Problem;
}

export interface ProblemResult {
  problem_id: string;
  order: string;
  wrongAttempts: number;
  firstACTime: number;
}

export interface Standing {
  user_id: number;
  user_name: string;
  solved: number;
  penalty: number;
  listProblem: ProblemResult[];
}

export interface Profile {
  id: string;
  username: string;
  email: string;

  solvedProblems: number;
  heatmapData: HeatmapDay[];
  imageUrl: string;
  // bio?: string;
  // avatarUrl?: string;

  // // Thống kê bài tập
  // solvedProblems: number;
  // rank: number;
  // totalScore: number;
  // contributions: number;

  // // Thống kê submission
  // submissionsLastYear: number;
  // submissionStats: {
  //   total: number;
  //   percentage: number;
  // };

  // // Thông tin contest
  // contestsJoined: number;
  // contestStats: {
  //   rank: number;
  //   currentRating: number;
  //   minRating: number;
  //   maxRating: number;
  //   ratingHistory: number[];
  // };

  // // Các mối quan hệ (nếu cần)
  // contests?: Contest[];
  // problems?: Problem[];
  // submissions?: Submission[];
  // standings?: Standing[];
}

export interface HeatmapDay {
  date: string;
  count: number;
}
