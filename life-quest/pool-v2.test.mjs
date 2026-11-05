import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,draw,nextRound,poolDefinition,poolVariants,PRIZES,VARIANTS,validateBackup,stats} from './engine.js';
import {JUNK_PRIZES,PREMIUM_PRIZES,prizeFlavor,prizeArtInfo} from './prize-catalog.js';

test('新版獎池預先列出 100 件惡搞及 30 件實用獎品',()=>{
  assert.equal(JUNK_PRIZES.length,100); assert.equal(PREMIUM_PRIZES.length,30);
  const added=[...JUNK_PRIZES,...PREMIUM_PRIZES];
  assert.equal(new Set(added.map(x=>x.name)).size,130);
  for(const item of added){assert.ok(prizeFlavor(item));assert.ok(prizeArtInfo(item.name));}
  for(const list of Object.values(VARIANTS)) for(const item of list) assert.ok(prizeFlavor(item));
  assert.ok(prizeFlavor({name:'艾特拉王冠'}));
  assert.deepEqual(poolDefinition(fresh()).map(p=>p.count),[1,8,29,10,122]);
});

test('抽完整池不放回、最後賞入庫，帳本及存檔保持一致',()=>{
  let s=fresh();s.balance=s.earned=17000;let last;
  for(let i=0;i<170;i++){last=draw(s,()=>0);assert.ok(s.pool.every(n=>n>=0));}
  assert.equal(s.balance,0);assert.equal(s.spent,17000);assert.equal(s.inventory.length,171);
  assert.equal(last.lastOne.name,'艾特拉王冠');assert.equal(s.transactions.length,170);
  assert.equal(new Set(s.transactions.map(t=>t.id)).size,170);assert.ok(validateBackup(s));
  nextRound(s);assert.equal(s.round,2);assert.deepEqual(s.pool,[1,8,29,10,122]);
});

test('舊存檔保留原獎池，抽空才切換新版',()=>{
  let s=fresh();delete s.poolEdition;s.pool=PRIZES.map(p=>p.count);s.balance=s.earned=4000;
  let first=draw(s,()=>0);assert.equal(first.name,VARIANTS.A[0].name);
  assert.throws(()=>nextRound(s));assert.equal(s.pool.reduce((a,b)=>a+b,0),39);assert.ok(validateBackup(s));
  for(let i=0;i<39;i++)draw(s,()=>0);
  nextRound(s);assert.equal(s.poolEdition,2);assert.equal(poolVariants(s).E.length,122);assert.deepEqual(s.pool,[1,8,29,10,122]);assert.ok(validateBackup(s));
  s.pool[0]=-1;assert.throws(()=>validateBackup(s));
});

test('高級裝備與技能可影響實際能力',()=>{
 let s=fresh(),base=stats(s),weapon={...PREMIUM_PRIZES.find(x=>x.kind==='equipment'&&x.slot==='weapon'),id:'weapon'};
 let passive={...PREMIUM_PRIZES.find(x=>x.kind==='passive'),id:'skill'};s.inventory.push(weapon,passive);s.equipped.weapon=weapon.id;s.skills.push(passive.id);
 assert.ok(stats(s).atk>base.atk);assert.ok(stats(s).skillPower>base.skillPower);
});
