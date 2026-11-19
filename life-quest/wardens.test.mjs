import test from 'node:test';
import assert from 'node:assert/strict';
import {guardianGate,guardianActor} from './wardens.js';
test('同區兩條路線的首領門檻各自顯示',()=>{
  const a={stage:1,stages:3,milestones:[{done:true},{done:false}]},b={stage:3,stages:3,milestones:[{done:true}]};
  assert.equal(guardianGate(a),'剩 2 關 · 1 項里程碑待驗收');
  assert.equal(guardianGate(b),'已解鎖首領');
  assert.equal(guardianGate({...a,stage:3}),'1 項里程碑待驗收');
  assert.equal(guardianGate({...b,bossDefeated:true}),'首領已擊敗');
  assert.equal(guardianActor('study'),'wardens/study');
});
