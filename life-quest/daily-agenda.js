import {questAvailable,questKey} from './engine.js?v=prizes20261105';

export function createAgenda(state){
 const legacy=new Map();
 for(const entry of state.transactions){
  if(!entry.sourceId?.startsWith('quest:'))continue;
  if(!legacy.has(entry.goalId))legacy.set(entry.goalId,new Set());
  const key=entry.sourceId;
  legacy.get(entry.goalId).add(key.slice(0,key.lastIndexOf(':')+1));
 }
 const claimed=(goal,quest,date)=>Boolean(state.claims[JSON.stringify([goal.id,questKey(quest,date)])])
  ||(!quest.recurring&&!!legacy.get(goal.id)?.has(`quest:${quest.id}:`));
 const forDay=date=>{
  const rows=state.goals.flatMap(goal=>goal.quests.filter(quest=>questAvailable(goal,quest,date))
   .map(quest=>({goal,quest,done:claimed(goal,quest,date)})));
  return {rows,done:rows.filter(row=>row.done).length};
 };
 return {forDay,claimed};
}
