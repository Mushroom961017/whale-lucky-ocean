// Read-only presentation state. A completed battle can belong to the previous chapter.
export function battleView(goal, battle) {
  const chapter = goal.chapters.find(c => !c.bossDefeated) || goal.chapters.at(-1);
  const current = battle?.goalId === goal.id ? battle : null;
  const arenaChapter = goal.chapters.find(c => c.id === current?.chapterId) || chapter;
  const bossNext = chapter.stage >= chapter.stages;
  const missing = bossNext ? chapter.milestones.filter(m => !m.done) : [];
  let phase;
  if (current && !current.result) phase = 'fighting';
  else if (chapter.bossDefeated) phase = 'cleared';
  else if (missing.length) phase = 'locked';
  else if (battle && !current && !battle.result) phase = 'elsewhere';
  else if (current?.result === 'lose') phase = 'retry';
  else if (current?.result === 'win') phase = 'advancing';
  else phase = 'ready';
  return {chapter, current, arenaChapter, bossNext, missing, phase};
}

export function hpFraction(hp, max) {
  return Number.isFinite(hp) && Number.isFinite(max) && max > 0
    ? Math.min(1, Math.max(0, hp / max)) : 0;
}
