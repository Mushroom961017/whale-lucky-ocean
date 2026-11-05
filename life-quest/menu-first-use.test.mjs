import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from './engine.js';

test('首次使用可跳過教學、建立角色並進入主選單',async()=>{
 let saved=fresh(),click;class Tx{constructor(){this.aborted=false}objectStore(){return {get:()=>{let r={};setTimeout(()=>{r.result=structuredClone(saved);r.onsuccess?.()},0);return r},put:v=>{saved=structuredClone(v);setTimeout(()=>{if(!this.aborted)this.oncomplete?.()},0)}}}abort(){this.aborted=true;this.onabort?.()}}
 let nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',value:'',open:false,isConnected:true,hidden:true,showModal(){this.open=true},close(){this.open=false},addEventListener(){},querySelector(){return null}});return nodes.get(id)};
 globalThis.indexedDB={open(){let r={result:{transaction:()=>new Tx()}};setTimeout(()=>r.onsuccess?.(),0);return r}};
 globalThis.document={hidden:false,querySelector:node,addEventListener:(n,f)=>{if(n==='click')click=f},querySelectorAll:()=>[],documentElement:{scrollHeight:0}};
 globalThis.window={matchMedia:()=>({matches:false}),addEventListener(){},scrollTo(){},innerHeight:900};globalThis.MutationObserver=class{observe(){}};globalThis.requestAnimationFrame=f=>f();let old=globalThis.setInterval;globalThis.setInterval=()=>0;
 try{
  await import('./app.js?first-use-menu-test');await new Promise(r=>setTimeout(r,25));
  let act=async(name)=>{let b={dataset:{action:name},disabled:false,isConnected:true};await click({target:{closest:()=>b}})};
  assert.match(node('#modal-content').innerHTML,/跳過所有教學/);await act('tutorial-skip');assert.equal(saved.tutorialSeen,true);
  assert.match(node('#modal-content').innerHTML,/冒險者名稱/);node('#character-name').value='小冒險者';await act('character');
  assert.equal(saved.character,'小冒險者');assert.equal(saved.balance,2000);assert.equal(saved.earned,2000);assert.equal(saved.transactions.filter(t=>t.type==='starter').length,1);
  assert.match(node('#modal-content').innerHTML,/開局禮/);assert.match(node('#main').innerHTML,/主選單/);assert.match(node('#main').innerHTML,/小冒險者/);
 }finally{globalThis.setInterval=old}
});

