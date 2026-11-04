import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from './engine.js';

// Browser API adapters exercise actual app event wiring; they do not emulate layout.
test('貼上計畫後先預覽，確認後才入庫，重複匯入被拒絕',async()=>{
 let saved={...fresh(),character:'測試角色',tutorialSeen:true},click,copied='';
 class Tx{
  constructor(){this.aborted=false}
  objectStore(){return {get:()=>{let r={};setTimeout(()=>{r.result=structuredClone(saved);r.onsuccess?.()},0);return r},put:v=>{saved=structuredClone(v);setTimeout(()=>{if(!this.aborted)this.oncomplete?.()},0)}}}
  abort(){this.aborted=true;this.onabort?.()}
 }
 let nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',open:false,isConnected:true,hidden:true,showModal(){this.open=true},close(){this.open=false},addEventListener(){},querySelector(){return null},scrollBy(){},focus(){},select(){}});return nodes.get(id)};
 globalThis.indexedDB={open(){let r={result:{transaction:()=>new Tx()}};setTimeout(()=>r.onsuccess?.(),0);return r}};
 globalThis.document={hidden:false,querySelector:node,addEventListener:(n,f)=>{if(n==='click')click=f},querySelectorAll:()=>[],documentElement:{scrollHeight:0}};
 globalThis.window={matchMedia:()=>({matches:false}),addEventListener(){},scrollTo(){},innerHeight:900};
 globalThis.MutationObserver=class{constructor(f){this.callback=f}observe(){}};
 globalThis.requestAnimationFrame=f=>f();
 const oldNavigator=Object.getOwnPropertyDescriptor(globalThis,'navigator');
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{async writeText(value){copied=value}}}});
 const originalSetInterval=globalThis.setInterval;globalThis.setInterval=()=>0;
 try{
  await import('./app.js?mobile-ui-test');await new Promise(r=>setTimeout(r,25));
  let act=async(name,data={})=>{let b={dataset:{action:name,...data},disabled:false,isConnected:true};await click({target:{closest:()=>b}})};
  assert.equal((node('#nav').innerHTML.match(/class="art-icon nav-art art-index-/g)||[]).length,8);
  assert.match(node('#nav').innerHTML,/data-page="adventure"/);assert.match(node('#nav').innerHTML,/冒險賞/);
  let mapNavigation={dataset:{page:'map'},disabled:false,isConnected:true};await click({target:{closest:()=>mapNavigation}});
  assert.equal((node('#main').innerHTML.match(/class="map-location"/g)||[]).length,8);
  for(const category of ['study','fitness','career','finance','health','creative','social','other'])assert.match(node('#main').innerHTML,new RegExp('region-'+category));
  await act('region-open',{region:'study'});assert.match(node('#modal-content').innerHTML,/智慧圖書館/);node('#modal').close();
  let navigation={dataset:{page:'tasks'},disabled:false,isConnected:true};await click({target:{closest:()=>navigation}});
  assert.match(node('#main').innerHTML,/用 GPT 規劃/);assert.match(node('#main').innerHTML,/未來七日計畫/);
  let date=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Taipei'});
  await act('prompt');node('#prompt-goal').value='日文';node('#prompt-start').value=date;node('#prompt-deadline').value='2027-12-31';node('#prompt-category').value='study';await act('generate');
  assert.match(node('#modal-content').innerHTML,/複製指令給 GPT/);await act('copy');assert.match(copied,/日文/);assert.match(node('#copy-feedback').textContent,/已複製/);assert.match(node('#modal-content').innerHTML,/貼上回覆/);
  let plan={goalId:'ui-123',goalCategory:'study',goalTitle:'日文',startDate:date,deadline:'2027-12-31',chapters:[{id:'c',title:'基礎',milestones:[{id:'m',title:'驗收',criteria:'通過'}]}],dailyQuests:[{id:'q',title:'單字',difficulty:'normal',recurring:true}],successCriteria:['能問路']};
  await act('import');node('#json').value='```json\n'+JSON.stringify(plan)+'\n```';node('#category').value='fitness';await act('import-preview');
  assert.match(node('#modal-content').innerHTML,/確認你的冒險/);assert.equal(saved.goals.length,0);
  await act('import-confirm');assert.equal(saved.goals.length,1);assert.equal(saved.goals[0].category,'fitness');assert.equal(saved.balance,0);
  await act('import');node('#json').value=JSON.stringify(plan);node('#category').value='fitness';await act('import-preview');
  assert.match(node('#import-error').textContent,/已匯入/);assert.equal(saved.goals.length,1);
 }finally{globalThis.setInterval=originalSetInterval;if(oldNavigator)Object.defineProperty(globalThis,'navigator',oldNavigator);else delete globalThis.navigator}
});
