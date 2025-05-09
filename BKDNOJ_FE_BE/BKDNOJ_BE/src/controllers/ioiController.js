function calculateIOIRanking(submissions, contestStartTime, problems) {
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
      (record.score === score && subTime < submit_time)
    ) {
      record.score = score;
      record.firstTimeScoreMax = subTime;
    }
  }

  const ioiRank = [];

  for (const [uid, problems] of Object.entries(groupedByUser)) {
    let score = 0;
    let total_time = 0;

    const listProblem = [];

    for (const [pid, rec] of Object.entries(problems)) {
      score += rec.score;
      total_time += rec.firstTimeScoreMax;

      listProblem.push({
        problem_id: pid,
        order: problemIdToOrder[pid].order || null,
        score: rec.score,
        firstTimeScoreMax: rec.firstTimeScoreMax,
      });
    }

    ioiRank.push({ user_id: uid, score, total_time, listProblem });
  }

  ioiRank.sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.total_time - b.total_time
  );

  return ioiRank;
}
