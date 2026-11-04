'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const DEFAULT={model:'classic',material:'wood',color:'#f0f2ef',support:1,detail:1,open:0};let selected={...DEFAULT},brief='';
function cleanConfig(c){return {model:c?.model==='classic'?'classic':'slim',material:['wood','acrylic','acrylicWhite'].includes(c?.material)?c.material:'wood',color:/^#[0-9a-f]{6}$/i.test(c?.color||'')?c.color:'#f0f2ef',support:Number(c?.support)===1?1:0,detail:1,open:0}}
function configPath(c){return './configurador.html?'+new URLSearchParams(cleanConfig(c))}
function setConfig(c){selected=cleanConfig(c);$('#quote-model').value=selected.model;$('#config-name').textContent='Totem '+(selected.model==='slim'?'Slim':'Classic');$('#config-detail').textContent=({wood:'Madeira branca',acrylic:'Acrílico transparente',acrylicWhite:'Acrílico colorido · '+selected.color.toUpperCase()}[selected.material])+' · '+(selected.model==='slim'?'base integrada':selected.support?'com suporte metálico':'sem suporte metálico');$('#fullscreen-link').href=configPath(selected)}
try{const saved=JSON.parse(localStorage.getItem('totem-studio-config'));if(saved)setConfig(saved)}catch{}
const params=new URLSearchParams(location.search);if(params.has('model')&&!params.has('quote'))location.replace('./configurador.html?'+params.toString());if(params.has('quote')){try{setConfig(JSON.parse(params.get('quote')))}catch{}requestAnimationFrame(()=>$('#orcamento').scrollIntoView())}else setConfig(selected);
$('.menu-btn').onclick=()=>{const open=$('#navigation').classList.toggle('open');$('.menu-btn').setAttribute('aria-expanded',open)};
$$('#navigation a').forEach(a=>a.onclick=()=>{$('#navigation').classList.remove('open');$('.menu-btn').setAttribute('aria-expanded','false')});
const heroOpening = $('.hero-opening');
const mainHero = $('.hero-sequence > .hero');
const heroModel = $('#hero-model');
const heroImage = $('.hero-model-fallback');
const heroStage = heroModel.parentElement;
const heroHint = $('#hero-hint');

if (!location.hash && !params.has('quote') && !params.has('model') &&
    scrollY < 20 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroOpening.hidden = false;
  mainHero.inert = true;
  mainHero.parentElement.classList.add('hero-opening-active');
  setTimeout(() => {
    heroOpening.classList.add('hero-opening-exit');
    mainHero.inert = false;
    mainHero.parentElement.classList.remove('hero-opening-active');
    setTimeout(() => { heroOpening.hidden = true; }, 550);
  }, 2150);
}

async function showHeroModel() {
  if (!await modelHasRendered(heroModel)) return;
  heroStage.classList.add('hero-model-ready');
  heroHint.textContent = 'Arraste para explorar em 360°';
}
heroModel.addEventListener('load', showHeroModel);
if (heroModel.loaded) showHeroModel();
heroModel.addEventListener('error', () => {
  heroStage.classList.remove('hero-model-ready');
  heroHint.textContent = 'Selecione um modelo';
});

for (const button of $$('[data-hero]')) {
  button.onclick = () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    const model = button.dataset.hero;
    const slim = model === 'slim';
    heroStage.classList.remove('hero-model-ready');
    heroHint.textContent = 'Selecione um modelo';
    heroImage.src = './assets/' + model + '.png';
    heroImage.alt = slim ? 'Totem Slim' : 'Totem Classic';
    heroModel.alt = 'Modelo 3D do ' + heroImage.alt;
    heroModel.src = './ar-models/' + (slim ? 'totem_slim_madeira_branca' : 'totem_com_suporte_madeira_branca') + '.glb?v=burger2';
    $$('[data-hero]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  };
}

function openLab(c, shouldScroll = true){if(c)setConfig(c);const frame=$('#config-frame');if(!frame.src){frame.src=configPath(selected)}else if(c){frame.contentWindow.postMessage({type:'totemlab:apply',config:selected},location.origin)}frame.hidden=false;$('#lab-poster').hidden=true;if (shouldScroll) $('#laboratorio').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
$('#start-lab').onclick=()=>openLab();$$('[data-configure]').forEach(b=>b.onclick=()=>openLab({...selected,model:b.dataset.configure,support:b.dataset.configure==='classic'?1:0}));
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==$('#config-frame').contentWindow)return;if(e.data?.type==='totemlab:config'||e.data?.type==='totemlab:quote'){setConfig(e.data.config);if(e.data.type==='totemlab:quote')$('#orcamento').scrollIntoView({behavior:'smooth'})}});
$('#quote-model').onchange=e=>{setConfig({...selected,model:e.target.value});const f=$('#config-frame');if(f.src)f.contentWindow.postMessage({type:'totemlab:apply',config:selected},location.origin)};
$('#quote-form').onsubmit=e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const d=new FormData(f);const url=new URL(configPath(selected),location.href);brief=['TOTEMLAB · RESUMO DO PROJETO','',`Estabelecimento: ${d.get('business').trim()}`,`Segmento: ${d.get('segment')}`,`Cidade / UF: ${d.get('city').trim()||'A definir'}`,`Quantidade: ${d.get('quantity')}`,'',`Modelo: ${$('#config-name').textContent}`,`Acabamento: ${$('#config-detail').textContent}`,`Serviços: ${d.getAll('service').join(', ')||'Somente equipamento'}`,'',`Necessidades: ${d.get('notes').trim()||'A definir'}`,'','Explore a configuração:',url.href,'','Valores, especificações e prazos sob consulta.','Este resumo não é uma proposta, não confirma compra e não foi enviado.'].join('\n');$('#brief-text').textContent=brief;$('#brief-status').textContent='';$('#brief-dialog').showModal()};
$('#download-brief').onclick=()=>{const blob=new Blob(['\ufeff'+brief],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='TotemLab-meu-projeto.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);$('#brief-status').textContent='Download do resumo iniciado.'};
$('#copy-brief').onclick=async()=>{try{await navigator.clipboard.writeText(brief);$('#brief-status').textContent='Resumo copiado.'}catch{$('#brief-status').textContent='Não foi possível copiar. Use “Baixar resumo”.'}};
$$('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
$('#privacy-open').onclick=()=>$('#privacy-dialog').showModal();$('#clear-local').onclick=()=>{try{localStorage.removeItem('totem-studio-config');setConfig(DEFAULT);const frame=$('#config-frame');if(frame.src)frame.contentWindow.postMessage({type:'totemlab:apply',config:DEFAULT},location.origin);$('#privacy-status').textContent='Preferências removidas deste navegador.'}catch{$('#privacy-status').textContent='O navegador não permitiu limpar as preferências.'}};
$('#year').textContent=new Date().getFullYear();
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target)}}),{threshold:.12});$$('.section-head,.product,.service-row,.process-grid>div,.quote-info,.quote-form,.faq details').forEach(e=>{e.classList.add('reveal');io.observe(e)})}
const scene=$('#story-model'),story=$('#design-story'),chapters=$$('[data-chapter]');let ticking=false,lastChapter=-1;
let storyProgress=0,storyKind='';
const storyFallback = $('.story-model-fallback');
const storyStage = scene.parentElement;

async function modelHasRendered(viewer) {
  const source = viewer.src;
  try {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const frame = new Image();
    frame.src = viewer.toDataURL('image/png');
    await frame.decode();
    if (viewer.src !== source) return false;
    const sample = document.createElement('canvas');
    sample.width = sample.height = 24;
    const ctx = sample.getContext('2d', {willReadFrequently:true});
    ctx.drawImage(frame, 0, 0, 24, 24);
    const pixels = ctx.getImageData(0, 0, 24, 24).data;
    return pixels.some((value, index) => index % 4 === 3 && value > 96);
  } catch {
    return false;
  }
}
async function verifyStoryRender() {
  if (await modelHasRendered(scene)) storyStage.classList.add('story-rendered');
}

function updateScroll(){ticking=false;const available=document.documentElement.scrollHeight-innerHeight;$('#scroll-progress').style.transform=`scaleX(${available>0?scrollY/available:0})`;if(!story)return;const rect=story.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;storyProgress=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-innerHeight)));const mobile = matchMedia('(max-width: 900px)').matches;
const readingLine = mobile ? scene.parentElement.getBoundingClientRect().bottom + 36 : innerHeight * .53;
const current = chapters.findIndex(chapter => chapter.getBoundingClientRect().bottom > readingLine);
const active = current === -1 ? chapters.length - 1 : current;const kind=storyProgress<.5?'slim':'classic';if(kind!==storyKind){storyKind=kind;storyStage.classList.remove('story-rendered');storyFallback.src='./assets/'+kind+'.png';scene.src='./ar-models/'+(kind==='slim'?'totem_slim_acrilico_branco':'totem_com_suporte_madeira_branca')+'.glb?v=burger2'}chapters.forEach((c,i)=>c.classList.toggle('active',i===active));const count=$('#story-count');const label='0'+(active+1)+' / 03';if(count.textContent!==label)count.textContent=label;$('#story-caption').textContent=kind==='slim'?'Totem Slim · explore todos os ângulos.':'Totem Classic · uma nova forma, uma volta completa.';const local=kind==='slim'?storyProgress*2:(storyProgress-.5)*2;scene.cameraOrbit=`${-30+local*360}deg 82deg auto`;scene.fieldOfView='29deg';scene.jumpCameraToGoal?.();applyStoryColor();}
function applyStoryColor(){if(!scene.model)return;const t=Math.min(1,storyProgress*4);const white=[.88,.89,.91],orange=[1,.102,.014];const color=white.map((v,i)=>v+(orange[i]-v)*t);scene.model.materials.filter(m=>/^Carcaca/.test(m.name)).forEach(m=>m.pbrMetallicRoughness.setBaseColorFactor([...color,1]));}
scene.addEventListener('load',()=>{updateScroll();applyStoryColor();verifyStoryRender()});scene.addEventListener('error',()=>{$('#story-caption').textContent='Abra o configurador para explorar os detalhes.'});
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll)}},{passive:true});window.addEventListener('resize',updateScroll);updateScroll();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});

const warmLab=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){const f=document.querySelector('#config-frame');if(!f.getAttribute('src'))f.src=configPath(selected);warmLab.disconnect()}},{rootMargin:'900px'});warmLab.observe(document.querySelector('#laboratorio'));
