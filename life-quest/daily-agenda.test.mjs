import test from 'node:test';
import assert from 'node:assert/strict';
import {createAgenda} from './daily-agenda.js';

test('今日領獎不會把其他目標的同名任務或明日的重複任務標成完成',()=>{
 const from='2026-11-17', next='2026-11-18';
 const quest={id:'same',recurring:true};
 const goal={id:'first',startDate:from,deadline:next,quests:[quest,{id:'appointment',recurring:false,date:next}]};
 const state={goals:[goal,{...goal,id:'second',quests:[quest]}],claims:{[JSON.stringify(['first',`quest:same:${from}`])]:true},transactions:[{goalId:'first',sourceId:'quest:appointment:2026-11-16'}]};
 const agenda=createAgenda(state),today=agenda.forDay(from),tomorrow=agenda.forDay(next);
 assert.deepEqual(today.rows.map(r=>[r.goal.id,r.quest.id,r.done]),[['first','same',true],['second','same',false]]);
 assert.deepEqual(tomorrow.rows.map(r=>[r.goal.id,r.quest.id,r.done]),[['first','same',false],['first','appointment',true],['second','same',false]]);
 assert.equal(today.done,1);assert.equal(tomorrow.done,1);
});
