import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parsePlanText,ensureUniqueGoal} from './plan-import.js';
import {normalize,fresh,claimQuest} from './engine.js';

const raw={goalId:'plan-test',goalCategory:'study',goalTitle:'旅遊日文',startDate:'2026-11-04',deadline:'2026-12-31',chapters:[{id:'chapter',title:'基礎',stages:1,milestones:[{id:'m',title:'驗收',criteria:'完成測驗'}]}],dailyQuests:[{id:'q',title:'練習日文',difficulty:'easy',recurring:true,exp:99999,nt:99999}],successCriteria:['會簡單自我介紹']};
test('接受原始 JSON 及 GPT 常見的程式碼區塊',()=>{
 assert.deepEqual(parsePlanText(JSON.stringify(raw)),raw);
 assert.deepEqual(parsePlanText('```json\n'+JSON.stringify(raw)+'\n```'),raw);
});
test('空白、格式錯誤及非物件資料提供可理解的錯誤',()=>{
 assert.throws(()=>parsePlanText(''),/請先貼上/);
 assert.throws(()=>parsePlanText('{not-json'),/JSON 格式不正確/);
 assert.throws(()=>parsePlanText('[]'),/JSON 物件/);
});
test('預覽分類可調整，重複目標無法建立兩次',()=>{
 let s=fresh(),g=normalize(parsePlanText(JSON.stringify(raw)),'fitness');
 assert.equal(g.category,'fitness');ensureUniqueGoal(s,g);s.goals.push(g);
 assert.throws(()=>ensureUniqueGoal(s,g),/已匯入/);
 assert.throws(()=>ensureUniqueGoal(s,{...g,id:'different'}),/已匯入/);
});
test('匯入的獎勵數值不生效，任務仍只能領取一次',()=>{
 let s=fresh(),g=normalize(raw);s.goals.push(g);claimQuest(s,g.id,'q','2026-11-04');
 assert.equal(s.exp,15);assert.equal(s.balance,20);
 assert.throws(()=>claimQuest(s,g.id,'q','2026-11-04'),/已領取/);
 assert.equal(s.balance,20);
});
