import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,createCharacter,STARTER_NT,validateBackup,draw} from './engine.js';

test('新角色收到一次開局禮，含唯一交易與來源',()=>{
 let s=fresh(),gift=createCharacter(s,' 冒險者 ','2026-11-05T00:00:00Z');
 assert.equal(s.character,'冒險者');assert.equal(gift.granted,2000);assert.equal(STARTER_NT,2000);
 assert.equal(s.balance,2000);assert.equal(s.earned,2000);assert.equal(s.exp,0);
 assert.equal(s.transactions.length,1);assert.equal(s.transactions[0].sourceId,'starter:welcome');
 assert.equal(s.transactions[0].nt,2000);assert.equal(s.transactions[0].id,gift.id);assert.ok(validateBackup(s));
});
test('重複建立角色或重新載入存檔不會重複領取',()=>{
 let s=fresh();createCharacter(s,'旅人');let saved=JSON.parse(JSON.stringify(s));
 assert.throws(()=>createCharacter(saved,'旅人'),/角色已建立/);assert.equal(saved.balance,2000);assert.equal(saved.transactions.length,1);
 saved.character='';assert.equal(createCharacter(saved,'旅人').granted,0);assert.equal(saved.balance,2000);assert.equal(saved.transactions.length,1);
});
test('原有角色不會自動增加台幣',()=>{
 let s=fresh();s.character='舊角色';s.balance=40;s.earned=40;
 assert.throws(()=>createCharacter(s,'舊角色'),/角色已建立/);assert.equal(s.balance,40);assert.equal(s.transactions.length,0);
});
test('開局禮可用於有限獎池且消費後帳本與備份仍一致',()=>{
 let s=fresh();createCharacter(s,'旅人');for(let i=0;i<20;i++)draw(s,()=>0);
 assert.equal(s.balance,0);assert.equal(s.spent,2000);assert.equal(s.inventory.length,20);assert.equal(s.pool.reduce((a,b)=>a+b,0),20);assert.ok(validateBackup(s));
});
