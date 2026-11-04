export function parsePlanText(text) {
  if (typeof text !== 'string' || !text.trim()) throw Error('請先貼上 GPT 回覆的 JSON。');
  let value=text.trim().replace(/^\uFEFF/, '');
  value=value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
  let data;
  try { data=JSON.parse(value); } catch { throw Error('JSON 格式不正確，請重新複製完整回覆，包含最前面的 { 和最後的 }。'); }
  if (!data || Array.isArray(data) || typeof data !== 'object') throw Error('計畫必須是一個 JSON 物件。');
  return data;
}

export function ensureUniqueGoal(state, goal) {
  if (state.goals.some(x => x.id === goal.id ||
    (x.title.trim().toLocaleLowerCase() === goal.title.trim().toLocaleLowerCase() &&
     x.category === goal.category && x.startDate === goal.startDate && x.deadline === goal.deadline))) {
    throw Error('此目標已匯入；為避免重複領取獎勵，請勿重複匯入。');
  }
}
