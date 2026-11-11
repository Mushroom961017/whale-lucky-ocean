// Purely visual transitions; the game state and transactions remain synchronous.
export function createTransitions({modal, content, motion, Observer, doc=globalThis.document}) {
  let closing = false;
  let revision = 0;
  let navigationVersion = 0, activeView = null, viewRendering = false;
  const reduced = () => Boolean(motion?.matches);
  const play = (element, frames, options) => {
    if (reduced() || typeof element?.animate !== 'function') return null;
    return element.animate(frames, options);
  };
  const enterPage = element => {
    if (!element || viewRendering) return;
    element.getAnimations?.().filter(a => a.id === 'life-quest-page').forEach(a => a.cancel());
    const animation = play(element, [
      {opacity: 0, transform: 'translateY(7px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 190, easing: 'cubic-bezier(.2,.75,.25,1)'});
    if (animation) animation.id = 'life-quest-page';
  };
  const observer = new Observer(() => {
    revision++;
    if (!modal.open || content.querySelector('.draw-sequence, .prize-reveal')) return;
    content.getAnimations?.().filter(a => a.id === 'life-quest-dialog').forEach(a => a.cancel());
    const animation = play(content, [
      {opacity: 0, transform: 'translateY(8px) scale(.985)'},
      {opacity: 1, transform: 'translateY(0) scale(1)'}
    ], {duration: 170, easing: 'cubic-bezier(.2,.75,.25,1)'});
    if (animation) animation.id = 'life-quest-dialog';
  });
  observer.observe(content, {childList: true});
  // Cross-fade actual rendered pages where supported; older browsers use enterPage.
  const navigate = update => {
    const version=++navigationVersion;
    activeView?.skipTransition?.();
    const apply=()=>{if(version!==navigationVersion)return;update()};
    if(reduced()||typeof doc?.startViewTransition!=='function'){apply();return}
    let invoked=false;
    try{
      const view=doc.startViewTransition(()=>{invoked=true;viewRendering=true;try{apply()}finally{viewRendering=false}});
      activeView=view;
      view.ready?.catch(()=>{});view.updateCallbackDone?.catch(()=>{});
      view.finished?.then(()=>{if(activeView===view)activeView=null},()=>{if(activeView===view)activeView=null});
    }catch{if(!invoked)apply()}
  };
  const close = () => {
    if (!modal.open || closing) return;
    const current = revision;
    const animation = play(modal, [
      {opacity: 1, transform: 'translateY(0) scale(1)'},
      {opacity: 0, transform: 'translateY(5px) scale(.99)'}
    ], {duration: 115, easing: 'ease-in'});
    if (!animation) { modal.close(); return; }
    closing = true;
    animation.onfinish = () => {
      closing = false;
      if (modal.open && revision === current) modal.close();
    };
    animation.oncancel = () => { closing = false; };
  };
  return {enterPage, navigate, close};
}

