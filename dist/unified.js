const rail=document.querySelector('.rail');if(rail){const items=['Restaurantes','Cafeterias','Padarias','Varejo','Serviços'];const group=items.map(x=>'<span class="sector-item"><i aria-hidden="true"></i>'+x+'</span>').join('');rail.innerHTML='<div class="sector-label"><span class="sector-dot"></span>Pensado para o seu negócio</div><div class="sector-window"><div class="rail-track"><div class="sector-group">'+group+'</div><div class="sector-group" aria-hidden="true">'+group+'</div></div></div>';rail.setAttribute('aria-label','Soluções para restaurantes, cafeterias, padarias, varejo e serviços')}
const steps=[...document.querySelectorAll('.process-grid>div')];
let journeyPending=false;
function updateJourney(){journeyPending=false;const grid=document.querySelector('.process-grid');if(!grid)return;const r=grid.getBoundingClientRect();const mobile=matchMedia('(max-width:700px)').matches;const total=Math.max(0,Math.min(steps.length,(innerHeight*.85-r.top)/Math.max(1,mobile?r.height:innerHeight*.6)*steps.length));steps.forEach((step,i)=>{const fill=Math.max(0,Math.min(1,total-i));step.style.setProperty('--step-fill',fill);step.classList.toggle('current',fill>0)});}
addEventListener('scroll',()=>{if(!journeyPending){journeyPending=true;requestAnimationFrame(updateJourney)}},{passive:true});addEventListener('resize',updateJourney);updateJourney();
function studioAction(index, shouldScroll = false) {
  openLab(undefined, shouldScroll);
  document.querySelectorAll('[data-studio]').forEach(button => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.studio) === index));
  });

  const frame = document.querySelector('#config-frame');
  function sendStep() {
    frame.contentWindow.postMessage({type: 'totemlab:step', step: index}, location.origin);
  }

  if (frame.contentDocument?.querySelector('#tl-next')) {
    frame.onload = null;
    sendStep();
  } else {
    frame.onload = () => {
      frame.onload = null;
      sendStep();
    };
  }
}
document.querySelectorAll('[data-studio]').forEach(b=>b.onclick=()=>studioAction(Number(b.dataset.studio)));document.querySelector('#environment-cta').onclick=()=>studioAction(3, true);
