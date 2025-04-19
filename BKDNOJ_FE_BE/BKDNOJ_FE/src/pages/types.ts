export interface Contest {
  id: string;
  name: string;
  date: string;
  duration: string;
  participants: number;
  isPast: boolean;
  isUserRegistered: boolean;
}

export interface Problem {
  id: string;
  solved: boolean;
  title: string;
  acPercentage: number;
  solved_count: number;
}

export interface Submission {
  id: string;
  status: string;
  language: string;
  user_name: string;
  problemTitle: string;
  date: string;
  time: string;
  execTime: string;
  memory: string;
  score: string;
  colorClass: string;
}

export interface ProblemResult {
  point: string;
  time: string;
}

export interface Standing {
  rank: number;
  user: string;
  point: string;
  penalty: string;
  problems: ProblemResult[];
}
