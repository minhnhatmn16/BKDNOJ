const penaltyPerWrong = 20 * 60 * 1000; // 20 phút tính bằng milliseconds
const contestStartTime = new Date("2025-05-05T08:00:00Z");

const groupedByUser = {};

for (const sub of submissions) {
  const { user_id, problem_id, status, submit_time } = sub;
  const key = `${user_id}-${problem_id}`;

  if (!groupedByUser[user_id]) groupedByUser[user_id] = {};

  if (!groupedByUser[user_id][problem_id]) {
    groupedByUser[user_id][problem_id] = {
      foundAC: false,
      wrongAttempts: 0,
      firstACTime: null,
    };
  }

  const record = groupedByUser[user_id][problem_id];
  const subTime = new Date(submit_time) - contestStartTime;

  if (record.foundAC) continue;

  if (status === "AC") {
    record.foundAC = true;
    record.firstACTime = subTime;
  } else {
    record.wrongAttempts += 1;
  }
}

const icpcRank = [];

for (const [uid, problems] of Object.entries(groupedByUser)) {
  let solved = 0;
  let penalty = 0;

  for (const [pid, rec] of Object.entries(problems)) {
    if (rec.foundAC) {
      solved += 1;
      penalty += rec.firstACTime + rec.wrongAttempts * penaltyPerWrong;
    }
  }

  icpcRank.push({ user_id: uid, solved, penalty });
}

// Xếp hạng: solved giảm dần, penalty tăng dần
icpcRank.sort((a, b) =>
  b.solved !== a.solved ? b.solved - a.solved : a.penalty - b.penalty
);
