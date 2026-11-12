// Voyager Dreadnought stage — pilot reload state (2.21.14). Pure, so it can be unit-tested without WebGL.
// p: a fleet entry from /api/boss/overlay ({stunned, fireAt, shootAt}); d: the overlay ({phase, cooldown}); f: per-ship memory
// ({wasReloading, readyUntil}, mutated); hostNow: host clock. Returns what the label should show.
export function reloadState(p,d,f,hostNow){
  const cd=(d.cooldown||3)*1000,fl=Math.max(0,(p.fireAt||0)-hostNow),sl=Math.max(0,(p.shootAt||0)-hostNow);
  const reloading=d.phase==='battle'&&!p.stunned&&(fl>0||sl>0);
  if(f.wasReloading&&!reloading&&!p.stunned)f.readyUntil=hostNow+1500;
  f.wasReloading=reloading;
  const ready=!reloading&&!p.stunned&&f.readyUntil>hostNow;
  return {reloading,ready,laser:Math.min(1,Math.max(0,1-fl/cd)),cannon:Math.min(1,Math.max(0,1-sl/cd)),text:p.stunned?p.name+' · SYSTEMS DOWN':ready?p.name+' · READY':p.name};
}
