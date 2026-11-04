// Integration uses same-origin messages and only accepts the containing page.
document.querySelector('.brand strong').textContent='TotemLab';
const siteHome=document.createElement('a');siteHome.href='./';siteHome.textContent='← Site';siteHome.className='site-home';siteHome.target='_top';document.querySelector('.brand').prepend(siteHome);
const quoteAction=document.createElement('button');quoteAction.textContent='Meu projeto ↗';quoteAction.className='quote-action';document.querySelector('.app-actions').prepend(quoteAction);
function notifySite(type='totemlab:config'){const config=configuration();if(window.parent!==window)window.parent.postMessage({type,config},location.origin);return config}
quoteAction.onclick=()=>{const c=notifySite('totemlab:quote');if(window.parent===window)location.href='./?quote='+encodeURIComponent(JSON.stringify(c))+'#orcamento'};
document.querySelectorAll('.panel select,.panel input').forEach(e=>{e.addEventListener('input',()=>notifySite());e.addEventListener('change',()=>notifySite())});
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==window.parent||e.data?.type!=='totemlab:apply')return;applyConfig(e.data.config);notifySite()});notifySite();
