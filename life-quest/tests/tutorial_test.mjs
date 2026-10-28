import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';
let saved,click,nodes;
const clone=x=>x===undefined?undefined:structuredClone(x);
class Tx { constructor(){this.aborted=false} objectStore(){return {get:()=>{let q={};setTimeout(()=>{q.result=clone(saved);q.onsuccess?.()},0);return q},put:v=>{saved=clone(v);setTimeout(()=>{if(!this.aborted)this.oncomplete?.()},0)}}} abort(){this.aborted=true;this.onabort?.()} }
globalThis.indexedDB={open:()=>{let q={result:{transaction:()=>new Tx(),createObjectStore(){}}};setTimeout(()=>q.onsuccess?.(),0);return q}};
globalThis.setInterval=()=>1;
globalThis.requestAnimationFrame=fn=>fn();
globalThis.window={innerHeight:768,scrollTo(){},scrollBy(){},addEventListener(){}};
globalThis.confirm=()=>true;
let count=0;
async function boot(){nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',value:'',hidden:false,open:false,addEventListener(){},showModal(){this.open=true},close(){this.open=false}});return nodes.get(id)};globalThis.document={hidden:false,documentElement:{scrollHeight:768},querySelector:node,querySelectorAll:()=>[],addEventListener:(type,fn)=>{if(type==='click')click=fn}};await import('../app.js?test='+count++);await delay(25);return node}
async function action(name,data={}){let b={dataset:{action:name,...data},isConnected:true,disabled:false};await click({target:{closest:()=>b}});await delay(10)}
let get=await boot();assert.match(get('#modal-content').innerHTML,/歡迎來到人生冒險/);assert.match(get('#modal-content').innerHTML,/跳過所有教學/);
await action('tutorial-next');assert.match(get('#modal-content').innerHTML,/建立第一個人生目標/);await action('tutorial-skip');assert.equal(saved.tutorialSeen,true);assert.match(get('#modal-content').innerHTML,/冒險者名稱/);
get=await boot();assert.match(get('#modal-content').innerHTML,/冒險者名稱/);assert.doesNotMatch(get('#modal-content').innerHTML,/跳過所有教學/);
get('#character-name').value='測試';await action('character');assert.equal(saved.character,'測試');get=await boot();assert.equal(get('#modal').open,false);delete saved.tutorialSeen;get=await boot();assert.equal(get('#modal').open,false);assert.equal(saved.character,'測試');
await action('tutorial-replay');for(let i=0;i<7;i++){assert.match(get('#modal-content').innerHTML,/跳過所有教學/);await action('tutorial-next')}assert.match(get('#modal-content').innerHTML,/追蹤成果並備份/);await action('tutorial-next');assert.equal(get('#modal').open,false);assert.equal(saved.character,'測試');
await action('prize-detail',{tier:'D',index:'0'});assert.match(get('#modal-content').innerHTML,/1 \/ 2/);await action('prize-detail',{tier:'D',index:'1'});assert.match(get('#modal-content').innerHTML,/2 \/ 2/);assert.match(get('#modal-content').innerHTML,/旋風劍舞/);
console.log('PASS: tutorial skip, persistence, replay, completion, and prize pagination');
