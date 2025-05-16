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
  problem_id: number;
  userStatus: string;
  problem_name: string;
  acPercentage: number;
  acceptedUserCount: number;
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
  user_id: string;
  user_name: string;
  email: string;
  avatar: string;
  solvedProblems: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
}
