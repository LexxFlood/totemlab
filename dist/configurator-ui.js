// TotemLab studio: visual choices backed by the existing 3D controls.
const tlPanel=document.getElementById('controls-panel'),tlId=id=>document.getElementById(id);
const tlNative=document.createElement('div');tlNative.hidden=true;tlNative.id='tl-native-controls';
const tlKeep={};['totem-model','housing','acrylic-colors','housing-note','component-panel','realistic','explode','separation','height','model-width','front','angle','back'].forEach(id=>tlKeep[id]=tlId(id));
const tlSupport=tlId('support').closest('p'),tlLayers=tlPanel.querySelector('.layers'),tlSeparateLabel=tlPanel.querySelector('label[for="separation"]');
tlPanel.prepend(tlNative);['totem-model','housing'].forEach(id=>tlNative.append(tlKeep[id]));
const tlContent=document.createElement('div');tlContent.className='tl-studio';tlContent.innerHTML=`<div class="tl-panel-heading"><span class="tl-eyebrow">SEU PROJETO, EM TEMPO REAL</span><h1>Vamos criar<br>o seu totem.</h1><p>Escolha os detalhes. Veja acontecer.</p></div><div class="tl-tabs" role="tablist" aria-label="Etapas da configuração">${['Modelo','Acabamento','Detalhes'].map((n,i)=>`<button id="tl-tab-${i}" role="tab" aria-controls="tl-step-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-step="${i}"><span>0${i+1}</span>${n}</button>`).join('')}</div><div class="tl-panels"><section id="tl-step-0" role="tabpanel" aria-labelledby="tl-tab-0"><h2>Qual é o seu estilo?</h2><p class="tl-help">Dois formatos para explorar.</p><div class="tl-models">${[['slim','Slim','Base integrada'],['classic','Classic','Suporte opcional']].map(([id,n,d])=>`<button class="tl-model" data-model="${id}" aria-pressed="false"><img src="./assets/${id}.png" alt="" width="140" height="150"><strong>${n}</strong><small>${d}</small><span class="tl-check" aria-hidden="true">✓</span></button>`).join('')}</div><div id="tl-support-slot"></div><div class="tl-dimensions"><span>DIMENSÕES DO CONCEITO</span><div id="tl-size-slot"></div><small>Medidas ilustrativas, sujeitas ao projeto técnico.</small></div></section><section id="tl-step-1" role="tabpanel" aria-labelledby="tl-tab-1" hidden><h2>Um acabamento com a sua cara.</h2><p class="tl-help">Toque para comparar no modelo.</p><div class="tl-materials">${[['wood','Madeira branca','Textura fosca · painel de 18 mm','wood'],['acrylicWhite','Acrílico colorido','Acabamento polido · painel de 6 mm','solid'],['acrylic','Acrílico transparente','Interior visível · painel de 6 mm','clear']].map(([id,n,d,c])=>`<button data-material="${id}" aria-pressed="false"><i class="tl-material-icon ${c}" aria-hidden="true"></i><span><strong>${n}</strong><small>${d}</small></span><span class="tl-check" aria-hidden="true">✓</span></button>`).join('')}</div><div id="tl-colors"><div class="tl-field-head"><strong>Cor do acrílico</strong><span id="tl-color-name"></span></div><div class="tl-swatches">${[['#f0f2ef','Branco'],['#171c22','Grafite'],['#2b67bf','Azul'],['#c83439','Vermelho'],['#2c9870','Verde'],['#edb92d','Amarelo'],['#ff5a1f','Laranja']].map(([c,n])=>`<button data-color="${c}" style="--swatch:${c}" aria-label="${n}" title="${n}" aria-pressed="false"></button>`).join('')}</div><div id="tl-custom-color"></div></div><div id="tl-material-note"></div></section><section id="tl-step-2" role="tabpanel" aria-labelledby="tl-tab-2" hidden><h2>Conheça cada detalhe.</h2><p class="tl-help">Separe as camadas ou aproxime um componente.</p><div id="tl-explosion"></div><div id="tl-component"></div><details class="tl-more-detail"><summary>Como o modelo é representado</summary><div id="tl-realism"></div><p>Componentes modelados a partir de referências visuais. A configuração final depende da validação técnica.</p></details></section></div><footer class="tl-panel-footer"><div><span id="tl-summary-title">Totem Slim</span><small id="tl-summary-finish"></small></div><button id="tl-next">Escolher acabamento →</button></footer>`;
tlSupport.className='tl-support';tlContent.querySelector('#tl-support-slot').append(tlSupport);
tlContent.querySelector('#tl-size-slot').append(tlKeep.height,document.createElement('br'),tlKeep['model-width']);
tlContent.querySelector('#tl-custom-color').append(tlKeep['acrylic-colors']);tlContent.querySelector('#tl-material-note').append(tlKeep['housing-note']);
tlContent.querySelector('#tl-explosion').append(tlKeep.explode,tlSeparateLabel,tlKeep.separation);const layerDetails=document.createElement('details');layerDetails.className='tl-layer-list';layerDetails.innerHTML='<summary>As 7 camadas do totem</summary>';layerDetails.append(tlLayers);tlContent.querySelector('#tl-explosion').append(layerDetails);
tlContent.querySelector('#tl-component').append(tlKeep['component-panel']);tlContent.querySelector('#tl-realism').append(tlKeep.realistic);
const tlClose=tlId('close-controls');[...tlPanel.children].forEach(e=>{if(e!==tlNative&&e!==tlClose)e.remove()});tlPanel.append(tlContent);tlPanel.setAttribute('aria-label','Estúdio de personalização');
spacePanelButton.textContent='Ver no meu espaço ↗';tlContent.querySelector('#tl-step-0').append(spacePanelButton);
const tlViews=document.createElement('div');tlViews.className='tl-view-controls';tlViews.setAttribute('aria-label','Ângulo do modelo');tlViews.append(tlKeep.front,tlKeep.angle,tlKeep.back);document.body.append(tlViews);
const tlBadge=document.createElement('div');tlBadge.className='tl-stage-badge';tlBadge.innerHTML='<span class="tl-eyebrow">SEU TOTEM</span><strong id="tl-stage-name"></strong><small id="tl-stage-finish"></small>';document.body.append(tlBadge);
const tlDemoPanel=document.createElement('aside');tlDemoPanel.className='tl-demo-panel';tlDemoPanel.innerHTML=`<span class="tl-eyebrow">EXPERIMENTE NA PRÁTICA</span><h2>O próximo pedido<br>é seu.</h2><p>Teste a experiência que seus clientes podem ter.</p><ol><li><span>01</span>Escolha e personalize os produtos.</li><li><span>02</span>Revise o pedido e simule o pagamento.</li><li><span>03</span>Veja o comprovante sair do totem.</li></ol><div class="tl-demo-summary"><small>SEU PEDIDO DEMONSTRATIVO</small><strong id="tl-cart-summary">Nenhum item ainda</strong></div><button id="tl-expand-order">Ampliar tela ↗</button><button id="tl-restart-order">Recomeçar pedido</button><small class="tl-demo-disclaimer">Ambiente demonstrativo, sem cobrança.</small>`;document.body.append(tlDemoPanel);
const tlMode=document.createElement('div');tlMode.className='tl-mode-switch';tlMode.setAttribute('aria-label','Modo do estúdio');tlMode.innerHTML='<button id="tl-design" aria-pressed="true">Personalizar</button><button id="tl-demo" aria-pressed="false">Testar atendimento</button>';document.querySelector('.app-header').insertBefore(tlMode,document.querySelector('.app-actions'));
const tlTools=document.createElement('details');tlTools.className='tl-tools';tlTools.innerHTML='<summary aria-label="Mais opções">•••</summary><div></div>';['save-image','share-app','install-app'].forEach(id=>tlTools.querySelector('div').append(tlId(id)));document.querySelector('.app-actions').append(tlTools);
const tlHome=document.createElement('a');tlHome.href='./';tlHome.target='_top';tlHome.textContent='Voltar ao site ↗';tlTools.querySelector('div').append(tlHome);
const tlMenuReset=document.createElement('button');tlMenuReset.textContent='Recomeçar demonstração';tlMenuReset.onclick=()=>{tlId('tl-restart-order').click();tlTools.open=false};tlTools.querySelector('div').prepend(tlMenuReset);
tlId('launch-order').hidden=true;document.querySelector('.brand span').textContent='ESTÚDIO DE PERSONALIZAÇÃO';
let tlStep=0;
function tlSetStep(step){tlStep=Math.max(0,Math.min(2,step));document.querySelectorAll('.tl-tabs button').forEach((b,i)=>{b.setAttribute('aria-selected',i===tlStep);b.tabIndex=i===tlStep?0:-1;tlId('tl-step-'+i).hidden=i!==tlStep});tlId('tl-next').textContent=['Escolher acabamento →','Explorar detalhes →','Usar no meu projeto ↗'][tlStep];tlPanel.scrollTop=0}
document.querySelectorAll('[data-step]').forEach(b=>{b.onclick=()=>tlSetStep(Number(b.dataset.step));b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();tlSetStep(e.key==='Home'?0:e.key==='End'?2:(tlStep+(e.key==='ArrowRight'?1:2))%3);tlId('tl-tab-'+tlStep).focus()}});
tlId('tl-next').onclick=()=>{if(tlStep<2)tlSetStep(tlStep+1);else document.querySelector('.quote-action').click()};
function tlChange(id,value,event='change'){const e=tlId(id);e.value=value;e.dispatchEvent(new Event(event,{bubbles:true}));tlSync();saveConfig();notifySite()}
document.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>tlChange('totem-model',b.dataset.model));document.querySelectorAll('[data-material]').forEach(b=>b.onclick=()=>tlChange('housing',b.dataset.material));document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>tlChange('acrylic-color',b.dataset.color,'input'));
function tlSync(){const name='Totem '+(totemModel==='slim'?'Slim':'Classic'),finish={wood:'Madeira branca',acrylicWhite:'Acrílico colorido',acrylic:'Acrílico transparente'}[housing];document.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.model===totemModel));document.querySelectorAll('[data-material]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.material===housing));document.querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.color.toLowerCase()===acrylicColor.toLowerCase()));tlId('tl-colors').hidden=housing==='wood';tlId('tl-color-name').textContent=acrylicColor.toUpperCase();tlId('tl-summary-title').textContent=name;tlId('tl-stage-name').textContent=name;tlId('tl-summary-finish').textContent=finish;tlId('tl-stage-finish').textContent=finish;tlId('acrylic-colors').hidden=false;tlId('housing-note').textContent=housing==='wood'?'Painéis de 18 mm com acabamento branco e espessura visível nos recortes.':housing==='acrylic'?'Acrílico translúcido de 6 mm para explorar o interior do modelo.':'Acrílico colorido de 6 mm com bordas polidas.';tlId('acrylic-preset').value=[...tlId('acrylic-preset').options].some(o=>o.value===acrylicColor)?acrylicColor:'custom';document.querySelector('#acrylic-colors>label').textContent='Escolha uma cor ou crie a sua';document.querySelectorAll('[data-material="acrylicWhite"] .tl-material-icon').forEach(e=>e.style.background=acrylicColor)}
tlPanel.addEventListener('input',tlSync);tlPanel.addEventListener('change',tlSync);const tlApply=applyConfig;applyConfig=function(c){tlApply(c);tlSync()};
let freeOrbit = false;
const tlZoom = zoomToOrder;
zoomToOrder = function(enabled) {
  if (enabled && freeOrbit) setFreeOrbit(false);
  if (!enabled) tlSetFullscreen(false);
  document.body.classList.toggle('tl-demo-mode', enabled);
  tlZoom(enabled);
  tlId('tl-design').setAttribute('aria-pressed', !enabled);
  tlId('tl-demo').setAttribute('aria-pressed', enabled);
  positionOrderScreen();
};

tlId('tl-design').onclick = () => zoomToOrder(false);
tlId('tl-demo').onclick = () => zoomToOrder(true);
tlId('tl-expand-order').onclick = toggleOrderFullscreen;

function tlSetFullscreen(enabled) {
  const wasFullscreen = window.orderFullscreen;
  window.orderFullscreen = enabled;
  document.body.classList.toggle('tl-screen-full', enabled);
  tlId('tl-expand-order').textContent = enabled ? 'Sair da tela cheia' : 'Tela cheia ↗';
  tlScreenToggle.textContent = enabled ? 'Sair da tela cheia ×' : 'Tela cheia ↗';
  tlScreenToggle.setAttribute('aria-pressed', String(enabled));
  if (wasFullscreen && !enabled && document.fullscreenElement === document.documentElement) {
    document.exitFullscreen().catch(() => {});
  }
  positionOrderScreen();
}

function toggleOrderFullscreen() {
  const enabled = !window.orderFullscreen;
  if (enabled && !document.body.classList.contains('tl-demo-mode')) zoomToOrder(true);
  tlSetFullscreen(enabled);
  if (enabled && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

const tlScreenToggle = document.createElement('button');
tlScreenToggle.id = 'tl-screen-toggle';
tlScreenToggle.type = 'button';
tlScreenToggle.textContent = 'Tela cheia ↗';
tlScreenToggle.setAttribute('aria-pressed', 'false');
document.body.append(tlScreenToggle);
tlScreenToggle.onclick = toggleOrderFullscreen;
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && window.orderFullscreen) tlSetFullscreen(false);
});

const tlPosition = positionOrderScreen;
positionOrderScreen = function() {
  if (!document.body.classList.contains('tl-demo-mode')) {
    tlPosition();
    return;
  }
  const full = window.orderFullscreen;
  const mobile = matchMedia('(max-width:760px)').matches;
  const panel = document.querySelector('.tl-demo-panel');
  const left = full || mobile ? 0 : panel.getBoundingClientRect().right;
  const top = full ? 60 : mobile ? 120 : 132;
  const width = Math.max(1, innerWidth - left);
  const height = Math.max(1, innerHeight - top - (!full && mobile ? 76 : 12));
  const ratio = Math.max(.001, Math.min((width - 24) / 720, height / 1440));
  Object.assign(orderLayer.style, {
    display: 'block', left: left + 'px', top: top + 'px',
    width: width + 'px', height: height + 'px'
  });
  orderPlane.style.transform = `matrix(${ratio},0,0,${ratio},${(width - 720 * ratio) / 2},${(height - 1440 * ratio) / 2})`;
};
addEventListener('resize', () => positionOrderScreen());

const tlOriginalPrint=window.printOrderReceipt;window.printOrderReceipt=function(order){tlSetFullscreen(false);document.body.classList.remove('tl-demo-mode');tlOriginalPrint(order)};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&window.orderFullscreen)tlSetFullscreen(false)});document.addEventListener('click',e=>{if(!tlTools.contains(e.target))tlTools.open=false});
const tlControls=controls;controls=function(open){if(open&&window.kioskView)zoomToOrder(false);tlControls(open);if(open)tlId('tl-tab-'+tlStep).focus({preventScroll:true})};document.addEventListener('keydown',e=>{if(e.key==='Escape')tlTools.open=false});
tlSync();tlSetStep(0);draw();

window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'totemlab:step') return;
  const step = event.data.step;
  if (![0, 1, 2, 3].includes(step)) return;
  if (step === 3) {
    openSpace();
    return;
  }
  if (spaceDialog.open) closeSpace();
  if (step === 2) {
    zoomToOrder(true);
    return;
  }
  if (window.kioskView) zoomToOrder(false);
  tlControls(true);
  tlSetStep(step === 1 ? 2 : 0);
});

// Keep the touchscreen usable while offering an explicit orbit mode.
const orbitTools=document.createElement('div');orbitTools.className='tl-orbit-tools';orbitTools.innerHTML='<button id="tl-orbit-mode" aria-pressed="false">Explorar 3D</button><button id="tl-orbit-reset" hidden>Centralizar</button><small id="tl-orbit-help" hidden>Arraste para girar · pinça para zoom · dois dedos para mover</small>';document.body.append(orbitTools);

function setFreeOrbit(enabled){freeOrbit=enabled;document.body.classList.toggle('tl-free-orbit',enabled);document.getElementById('tl-orbit-mode').setAttribute('aria-pressed',enabled);document.getElementById('tl-orbit-mode').textContent=enabled?'Usar tela do totem':'Explorar 3D';document.getElementById('tl-orbit-reset').hidden=!enabled;document.getElementById('tl-orbit-help').hidden=!enabled;if(enabled){tlSetFullscreen(false);zoomToOrder(false);window.receiptView=null;window.kioskView=null;}draw()}
document.getElementById('tl-orbit-mode').onclick=()=>{if(freeOrbit)zoomToOrder(true);else setFreeOrbit(true)};document.getElementById('tl-orbit-reset').onclick=()=>{window.tlPanX=0;window.tlPanY=0;az=.45;el=.15;scale=totemModel==='slim'?1.06:showSupport?1.25:.94;draw()};
const orbitMove=canvas.onpointermove;canvas.onpointermove=e=>{if(freeOrbit&&pointers.has(e.pointerId)){const old=pointers.get(e.pointerId);if(pointers.size===2){window.tlPanX=(window.tlPanX||0)-(e.clientX-old[0])/canvas.clientHeight*scale;window.tlPanY=(window.tlPanY||0)+(e.clientY-old[1])/canvas.clientHeight*scale}else if(e.shiftKey||e.buttons===2){window.tlPanX=(window.tlPanX||0)-(e.clientX-old[0])/canvas.clientHeight*scale*2;window.tlPanY=(window.tlPanY||0)+(e.clientY-old[1])/canvas.clientHeight*scale*2;pointers.set(e.pointerId,[e.clientX,e.clientY]);draw();return}}orbitMove(e)};canvas.addEventListener('contextmenu',e=>{if(freeOrbit)e.preventDefault()});

// The web camera can host the same live order screen used by Experimente.
const spaceOrderHome = orderLayer.parentNode;
const spaceOrderButton = document.createElement('button');
spaceOrderButton.type = 'button';
spaceOrderButton.className = 'space-primary';
spaceOrderButton.textContent = 'Testar pedido no ambiente ↗';
spEl('space-manual-controls').prepend(spaceOrderButton);

const spaceOrderOverlay = document.createElement('section');
spaceOrderOverlay.className = 'space-order-overlay';
spaceOrderOverlay.hidden = true;
spaceOrderOverlay.setAttribute('aria-label', 'Pedido demonstrativo no ambiente');
spaceOrderOverlay.innerHTML = '<button type="button" class="space-order-close">Voltar ao ambiente ×</button><div class="space-order-paper" role="status" hidden></div>';
spaceDialog.append(spaceOrderOverlay);
const spaceOrderBack = spaceOrderOverlay.querySelector('.space-order-close');
const spaceOrderPaper = spaceOrderOverlay.querySelector('.space-order-paper');

function leaveSpaceOrder() {
  if (spaceOrderOverlay.hidden) return;
  spaceOrderOverlay.hidden = true;
  spaceOrderPaper.hidden = true;
  cleanProjectedLCD();
  spaceOrderHome.append(orderLayer);
  positionOrderScreen();
  if (spaceDialog.open) spaceOrderButton.focus({preventScroll:true});
}
spaceOrderBack.onclick = leaveSpaceOrder;
spaceDialog.addEventListener('close', leaveSpaceOrder);
spaceDialog.addEventListener('cancel', event => {
  if (!spaceOrderOverlay.hidden) {
    event.preventDefault();
    event.stopImmediatePropagation();
    leaveSpaceOrder();
  }
}, true);

const printStudioOrder = window.printOrderReceipt;
window.printOrderReceipt = function(order) {
  if (spaceOrderOverlay.hidden) {
    printStudioOrder(order);
    return;
  }
  if (!order) return;
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Fechar notinha ×';
  const receipt = document.createElement('pre');
  const lines = order.items.map(item => item.quantity + '× ' + item.name + '  ' + money(item.unit * item.quantity));
  receipt.textContent = ['LAB KITCHEN', 'Pedido #' + order.number, '', ...lines, '', 'Total  ' + money(order.total), '', 'DEMONSTRAÇÃO · SEM VALOR FISCAL'].join('\n');
  spaceOrderPaper.replaceChildren(close, receipt);
  spaceOrderPaper.hidden = false;
  close.onclick = () => { spaceOrderPaper.hidden = true; spaceOrderBack.focus(); };
  close.focus({preventScroll:true});
};

spEl('space-size').min = '15';
spEl('space-confirm').textContent = 'Fixar nesta posição ✓';
const spaceZoomOut = document.createElement('button');
spaceZoomOut.type = 'button';
spaceZoomOut.textContent = '− Diminuir zoom';
spEl('space-fine-controls').before(spaceZoomOut);
spaceZoomOut.onclick = () => {
  spSaveHistory();
  spEl('space-size').value = Math.max(15, Math.round(spaceState.scale * 100) - 10);
  updateSpaceSize();
};

function configureWallViewer() {
  if (!spaceViewer) return;
  const height = totemModel === 'slim' ? 1.8 : showSupport ? 2.011 : 1.47;
  const scale = String(1.8 / height);
  spaceViewer.setAttribute('scale', [scale, scale, scale].join(' '));
  spaceViewer.setAttribute('ar-placement', 'wall');
  spaceViewer.setAttribute('ar-scale', 'auto');
  spEl('space-summary').textContent = 'Totem ' + (totemModel === 'slim' ? 'Slim' : 'Classic') + ' · altura inicial de 1,80 m';
}

const nativeSpaceStatus = updateSpaceSupport;
updateSpaceSupport = function() {
  nativeSpaceStatus();
  if (!spaceDialog.open || !spaceViewer?.loaded) return;
  configureWallViewer();
  spEl('space-ar-note').textContent = 'Aponte para uma parede na RA. Para testar pedidos e a notinha, use a câmera ou uma foto dentro do site.';
};
const startNativeSpace = spEl('space-ar').onclick;
spEl('space-ar').onclick = () => {
  configureWallViewer();
  startNativeSpace();
};
new MutationObserver(() => {
  if (spaceDialog.open) configureWallViewer();
}).observe(spaceStage, {childList:true});
spaceStage.addEventListener('ar-status', event => {
  if (event.detail.status !== 'session-started') return;
  const guide = spaceViewer?.querySelector('.sp-native-guide');
  if (guide) guide.textContent = 'Aponte o celular para uma parede.';
  spaceMessage('Aponte o celular para uma parede.');
}, true);

// Track the four vertices of the LCD mesh in each room-preview GLB.
const lcdSlots = ['hotspot-order-tl','hotspot-order-tr','hotspot-order-br','hotspot-order-bl'];
let projectedOrderFrame = 0;
let projectedOrderViewer;
let projectedOrderSource;

function installLCDHotspots(viewer) {
  const source = viewer.getAttribute('src');
  if (viewer === projectedOrderViewer && source === projectedOrderSource) return;
  projectedOrderViewer = viewer;
  projectedOrderSource = source;
  viewer.querySelectorAll('[data-order-corner]').forEach(node => node.remove());
  const lcdNode = totemModel === 'slim' ? 10 : showSupport ? 19 : 9;
  const triangles = ['3 4 5 0 0 1', '0 1 2 0 0 1', '0 1 2 0 1 0', '0 1 2 1 0 0'];
  lcdSlots.forEach((slot, index) => {
    const corner = document.createElement('span');
    corner.slot = slot;
    corner.dataset.orderCorner = '';
    corner.dataset.surface = lcdNode + ' 0 ' + triangles[index];
    corner.setAttribute('aria-hidden', 'true');
    viewer.append(corner);
  });
}

// Perspective transform from the 720 × 1440 order plane to the projected LCD quad.
function lcdProjection([a, b, c, d]) {
  const x1 = b.x-c.x, x2 = d.x-c.x, x3 = a.x-b.x+c.x-d.x;
  const y1 = b.y-c.y, y2 = d.y-c.y, y3 = a.y-b.y+c.y-d.y;
  const determinant = x1*y2-x2*y1;
  const winding = (b.x-a.x)*(d.y-a.y)-(b.y-a.y)*(d.x-a.x);
  if (Math.abs(determinant) < .01 || winding < 4) return null;
  const g = (x3*y2-x2*y3)/determinant, h = (x1*y3-x3*y1)/determinant;
  return [
    (b.x-a.x+g*b.x)/720, (b.y-a.y+g*b.y)/720, 0, g/720,
    (d.x-a.x+h*d.x)/1440, (d.y-a.y+h*d.y)/1440, 0, h/1440,
    0,0,1,0,a.x,a.y,0,1
  ];
}

function positionProjectedOrder() {
  if (!spaceViewer?.loaded) { orderLayer.style.display = 'none'; return; }
  installLCDHotspots(spaceViewer);
  const stage = spaceStage.getBoundingClientRect();
  const view = spaceViewer.getBoundingClientRect();
  const points = lcdSlots.map(slot => spaceViewer.queryHotspot(slot));
  if (points.some(point => !point?.facingCamera || Math.abs(point.canvasPosition.z) > 1)) {
    orderLayer.style.display = 'none';
    return;
  }
  const matrix = lcdProjection(points.map(({canvasPosition: p}) => ({
    x: view.left-stage.left+p.x*view.width/spaceViewer.clientWidth,
    y: view.top-stage.top+p.y*view.height/spaceViewer.clientHeight
  })));
  if (!matrix || matrix.some(value => !Number.isFinite(value))) {
    orderLayer.style.display = 'none';
    return;
  }
  Object.assign(orderLayer.style, {display:'block',left:'0',top:'0',width:spaceStage.clientWidth+'px',height:spaceStage.clientHeight+'px'});
  const transform = 'matrix3d(' + matrix.join(',') + ')';
  if (orderPlane.style.transform !== transform) orderPlane.style.transform = transform;
}

const positionRoomOrder = positionOrderScreen;
positionOrderScreen = function() {
  if (!spaceOrderOverlay.hidden) positionProjectedOrder();
  else positionRoomOrder();
};

function followProjectedLCD() {
  projectedOrderFrame = 0;
  if (spaceOrderOverlay.hidden || !spaceDialog.open) return;
  positionProjectedOrder();
  projectedOrderFrame = requestAnimationFrame(followProjectedLCD);
}

spaceOrderButton.textContent = 'Usar a tela do totem 3D ↗';
spaceOrderButton.onclick = () => {
  if (!spaceViewer?.loaded) return;
  spSetMode('look');
  if (freeOrbit) setFreeOrbit(false);
  spaceOrderOverlay.hidden = false;
  spaceStage.classList.add('space-live-lcd');
  spaceStage.append(orderLayer);
  followProjectedLCD();
  spaceOrderBack.focus({preventScroll:true});
};

function cleanProjectedLCD() {
  cancelAnimationFrame(projectedOrderFrame);
  projectedOrderFrame = 0;
  spaceStage.classList.remove('space-live-lcd');
}

// Keep native AR available independently of the optional guided demo.
const quickLookLink = document.createElement('a');
quickLookLink.rel = 'ar';
if (quickLookLink.relList.supports('ar')) {
  const prepare = document.createElement('button');
  prepare.type = 'button';
  prepare.className = 'space-primary';
  prepare.textContent = 'Preparar demonstração no Quick Look';
  const poster = document.createElement('img');
  poster.alt = 'Abrir demonstração de pedido no Quick Look';
  poster.width = 44;
  poster.height = 44;
  quickLookLink.append(poster);
  quickLookLink.hidden = true;
  quickLookLink.setAttribute('aria-label', poster.alt);
  quickLookLink.title = poster.alt;
  spEl('space-ar').after(prepare, quickLookLink);
  const launchHint = document.createElement('p');
  launchHint.hidden = true;
  quickLookLink.after(launchHint);
  let demoURL, generation = 0;
  spaceDialog.addEventListener('close', () => {
    generation++;
    if (demoURL) URL.revokeObjectURL(demoURL);
    demoURL = undefined;
    quickLookLink.hidden = true;
    launchHint.hidden = true;
    prepare.hidden = false;
    prepare.disabled = false;
  });
  prepare.onclick = async () => {
    if (!spaceViewer?.loaded) {
      spaceMessage('Aguarde o carregamento do totem e tente novamente.');
      return;
    }
    const current = ++generation;
    prepare.disabled = true;
    spaceMessage('Preparando o pedido de demonstração…');
    try {
      const slim = totemModel === 'slim';
      const {prepareQuickLookDemo} = await import('./quicklook-demo.js');
      const url = await prepareQuickLookDemo(spaceViewer, slim);
      if (current !== generation) { URL.revokeObjectURL(url); return; }
      demoURL = url;
      poster.src = slim ? './assets/slim.png' : './assets/classic.png';
      quickLookLink.href = url;
      quickLookLink.download = 'totemlab-pedido-demo.usdz';
      quickLookLink.hidden = false;
      prepare.hidden = true;
      launchHint.textContent = 'Toque na imagem do totem para abrir a demonstração. Na RA, toque no visor para iniciar o pedido e ver a notinha sair.';
      launchHint.hidden = false;
      spaceMessage('Demonstração pronta.');
      quickLookLink.focus();
    } catch (error) {
      if (current === generation) spaceMessage('Não foi possível preparar a demonstração. Tente novamente.');
      console.warn('Quick Look demo:', error);
    } finally {
      if (current === generation) prepare.disabled = false;
    }
  };
}
