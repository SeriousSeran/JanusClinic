// Progressive enhancement: visible content remains available without animation support.
(()=>{
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(!('IntersectionObserver' in window)||!Element.prototype.animate)return;
 const seen=new WeakSet(),animations=new Set();
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);if(preference.matches)continue;
   const animation=entry.target.animate([{opacity:.88,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.7,.2,1)'});
   animations.add(animation);animation.onfinish=()=>animations.delete(animation);animation.oncancel=()=>animations.delete(animation);
  }
 },{threshold:.06});
 function discover(){document.querySelectorAll('main > section,main > div > section,main article').forEach(element=>{if(!seen.has(element)){seen.add(element);observer.observe(element);}});}
 let scheduled=false;
 const mutations=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;discover();});});
 discover();mutations.observe(document.body,{childList:true,subtree:true});
 preference.addEventListener('change',()=>{if(preference.matches){for(const animation of animations)animation.cancel();}});
})();

(()=>{function ready(){document.querySelectorAll('.janus-loader').forEach(loader=>{loader.classList.add('leaving');setTimeout(()=>loader.remove(),350);});}if(document.readyState==='complete')ready();else addEventListener('load',ready,{once:true});setTimeout(ready,5000);})();
