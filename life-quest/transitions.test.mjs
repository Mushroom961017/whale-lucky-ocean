import test from 'node:test';
import assert from 'node:assert/strict';
import {createTransitions} from './transitions.js';

function fixture(reduce = false) {
  const animations = [];
  function element() {
    return {
      animate(frames, options) {
        const animation = {frames, options, cancelled:false, cancel() { this.cancelled=true; this.oncancel?.(); }};
        animations.push(animation);
        return animation;
      },
      getAnimations() { return animations; }
    };
  }
  const modal = {...element(), open:true, closeCount:0, close() {this.open=false;this.closeCount++;}};
  const content = {...element(), special:false, querySelector() {return this.special ? {} : null;}};
  let observer;
  class Observer {
    constructor(callback) { this.callback=callback; observer=this; }
    observe(target, options) {this.target=target;this.options=options;}
    trigger() {this.callback();}
  }
  const motion={matches:reduce};
  const controller=createTransitions({modal,content,motion,Observer});
  return {controller,animations,modal,content,motion,observer};
}

test('頁面過場可重入，後一次切換會停止前一次動畫', () => {
  const f=fixture();const root={animate:f.content.animate,getAnimations:()=>f.animations};
  f.controller.enterPage(root);f.controller.enterPage(root);
  assert.equal(f.animations.length,2);assert.equal(f.animations[0].cancelled,true);
  assert.equal(f.animations[1].id,'life-quest-page');
});
test('減少動態效果時，頁面與視窗略過動畫並立即關閉', () => {
  const f=fixture(true);f.controller.enterPage(f.content);f.observer.trigger();f.controller.close();
  assert.equal(f.animations.length,0);assert.equal(f.modal.open,false);assert.equal(f.modal.closeCount,1);
});
test('視窗內容更新會播放過場，抽獎動畫及關閉視窗不會被干擾', () => {
  const f=fixture();f.observer.trigger();assert.equal(f.animations.length,1);
  f.content.special=true;f.observer.trigger();assert.equal(f.animations.length,1);
  f.content.special=false;f.modal.open=false;f.observer.trigger();assert.equal(f.animations.length,1);
});
test('重複按下關閉只建立一次動畫，結束後關閉一次', () => {
  const f=fixture();f.controller.close();f.controller.close();assert.equal(f.animations.length,1);
  assert.equal(f.modal.open,true);f.animations[0].onfinish();assert.equal(f.modal.closeCount,1);
});
test('關閉動畫期間若視窗內容更新，不會誤關新的畫面', () => {
  const f=fixture();f.controller.close();const closing=f.animations[0];f.observer.trigger();closing.onfinish();
  assert.equal(f.modal.open,true);assert.equal(f.modal.closeCount,0);
});
test('不支援 Web Animations 時仍可關閉視窗', () => {
  const f=fixture();delete f.modal.animate;f.controller.close();assert.equal(f.modal.open,false);
});
