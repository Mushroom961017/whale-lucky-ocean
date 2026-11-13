import test from 'node:test';
import assert from 'node:assert/strict';
import {battleView,hpFraction} from './battle-view.js';

test('首領門檻、跨章節名稱和通關狀態分開呈現',()=>{
 const goal={id:'goal',chapters:[{id:'old',stage:1,stages:1,bossDefeated:true,milestones:[]},{id:'now',stage:1,stages:1,milestones:[{id:'work',done:false}]}]};
 const victory={goalId:'goal',chapterId:'old',boss:true,result:'win'};
 const locked=battleView(goal,victory);
 assert.equal(locked.phase,'locked');assert.equal(locked.arenaChapter.id,'old');assert.equal(locked.chapter.id,'now');assert.equal(locked.missing[0].id,'work');
 goal.chapters[1].milestones[0].done=true;assert.equal(battleView(goal,victory).phase,'advancing');
 goal.chapters[1].bossDefeated=true;assert.equal(battleView(goal,victory).phase,'cleared');
});

test('另一目標的戰鬥不應顯示在目前場景；血量比例安全限制在 0～1',()=>{
 const goal={id:'second',chapters:[{id:'chapter',stage:0,stages:2,milestones:[]}]};
 const view=battleView(goal,{goalId:'first',result:null});
 assert.equal(view.phase,'elsewhere');assert.equal(view.current,null);
 assert.equal(hpFraction(23,50),.46);assert.equal(hpFraction(-3,50),0);assert.equal(hpFraction(60,50),1);assert.equal(hpFraction(8,0),0);
});
