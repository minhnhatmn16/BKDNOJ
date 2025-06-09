function calculateICPCRanking(
  submissions,
  contestStartTime,
  problems,
  penaltyPerWrong,
  participants
) {
  // Tạo ánh xạ problem_id -> order
  const problemIdToOrder = {};
  for (const p of problems) {
    problemIdToOrder[p.problem_id] = p.order;
  }

  const groupedByUser = {};

  for (const sub of submissions) {
    const { user_id, problem_id, status, submit_time } = sub;
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
    } else if (status !== "Pending") {
      record.wrongAttempts += 1;
    }
  }

  const icpcRank = [];

  for (const participant of participants) {
    const uid = participant.User.user_id;
    const uname = participant.User.user_name;

    const problemsMap = groupedByUser[uid] || {};

    let solved = 0;
    let penalty = 0;

    const listProblem = [];

    for (const pid of Object.keys(problemIdToOrder)) {
      const rec = problemsMap[pid] || {
        foundAC: false,
        wrongAttempts: 0,
        firstACTime: null,
      };

      if (rec.foundAC) {
        solved += 1;
        penalty +=
          Math.floor(rec.firstACTime / 60000) +
          rec.wrongAttempts * penaltyPerWrong;
      }
      listProblem.push({
        problem_id: pid,
        order: problemIdToOrder[pid] || null,
        wrongAttempts: rec.wrongAttempts,
        firstACTime:
          rec.firstACTime !== null ? Math.floor(rec.firstACTime / 60000) : null,
      });
    }

    icpcRank.push({
      user_id: uid,
      user_name: uname,
      solved,
      penalty,
      listProblem,
    });
  }

  icpcRank.sort((a, b) =>
    b.solved !== a.solved ? b.solved - a.solved : a.penalty - b.penalty
  );

  return icpcRank;
}

function calculateIOIRanking(
  submissions,
  contestStartTime,
  problems,
  participants
) {
  // Tạo ánh xạ problem_id -> order
  const problemIdToOrder = {};
  for (const p of problems) {
    problemIdToOrder[p.problem_id] = p;
  }

  const groupedByUser = {};

  for (const sub of submissions) {
    const { user_id, problem_id, submit_time, passed_test, total_test } = sub;

    if (!groupedByUser[user_id]) groupedByUser[user_id] = {};

    if (!groupedByUser[user_id][problem_id]) {
      groupedByUser[user_id][problem_id] = {
        score: 0,
        firstTimeScoreMax: null,
      };
    }

    const record = groupedByUser[user_id][problem_id];
    const subTime = new Date(submit_time) - contestStartTime;
    if (total_test === 0) continue;
    score = problemIdToOrder[problem_id].point * (passed_test / total_test);
    if (
      record.score < score ||
      (record.score === score && subTime < record.firstTimeScoreMax)
    ) {
      record.score = score;
      record.firstTimeScoreMax = subTime;
    }
  }

  const ioiRank = [];

  for (const participant of participants) {
    const uid = participant.User.user_id;
    const uname = participant.User.user_name;

    const problemsMap = groupedByUser[uid] || {};

    let score = 0;
    let total_time = 0;

    const listProblem = [];

    for (const pid of Object.keys(problemIdToOrder)) {
      const rec = problemsMap[pid] || {
        score: 0,
        firstTimeScoreMax: null,
      };
      score += rec.score;
      total_time +=
        rec.firstTimeScoreMax !== null
          ? Math.floor(rec.firstTimeScoreMax / 60000)
          : 0;

      listProblem.push({
        problem_id: pid,
        order: problemIdToOrder[pid].order || null,
        score: rec.score,
        firstTimeScoreMax:
          rec.firstTimeScoreMax !== null
            ? Math.floor(rec.firstTimeScoreMax / 60000)
            : null,
      });
    }

    ioiRank.push({
      user_id: uid,
      user_name: uname,
      score,
      total_time,
      listProblem,
    });
  }

  ioiRank.sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.total_time - b.total_time
  );

  return ioiRank;
}

module.exports = {
  calculateICPCRanking,
  calculateIOIRanking,
};
