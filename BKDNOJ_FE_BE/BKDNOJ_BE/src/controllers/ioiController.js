const ioiScores = {};

for (const sub of submissions) {
  const { user_id, problem_id, score, submit_time } = sub;
  const key = `${user_id}-${problem_id}`;

  if (!ioiScores[key] || 
      score > ioiScores[key].score || 
     (score === ioiScores[key].score && submit_time < ioiScores[key].submit_time)) {
    ioiScores[key] = { score, submit_time };
  }
}

const totalScores = {};

for (const [key, { score }] of Object.entries(ioiScores)) {
  const user_id = key.split("-")[0];
  totalScores[user_id] = (totalScores[user_id] || 0) + score;
}

const ioiRank = Object.entries(totalScores)
  .map(([uid, score]) => ({ user_id: uid, score }))
  .sort((a, b) => b.score - a.score);
