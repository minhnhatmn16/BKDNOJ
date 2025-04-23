export interface Contest {
  id: string;
  name: string;
  date: string;
  duration: string;
  participants: number;
  isPast: boolean;
  isUserRegistered: boolean;
  listProblem: Problem[];
}

export interface Problem {
  id: string;
  solved: boolean;
  title: string;
  acPercentage: number;
  solved_count: number;
  timeLimit: string;
  memoryLimit: string;
  pdfUrl?: string;
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
