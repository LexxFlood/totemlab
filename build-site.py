from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parent
D=ROOT/'dist'
# Keep the established application intact at its own route.
app=(D/'configurador.html' if (D/'configurador.html').exists() else D/'index.html').read_text(encoding='utf8')
if '// Integration uses same-origin' not in app:
    app=app.replace('Totem Studio','TotemLab')
    app=app.replace('https://totemlab-orange.albert7pereira.chatgpt.site/','https://totemlab-orange.albert7pereira.chatgpt.site/configurador.html')
    app=app.replace('</style>','''.site-home{color:#ff5a1f;font-size:12px;text-decoration:none;margin-right:8px}.app-actions .quote-action{background:#ff5a1f;color:#fff}.brand strong{color:#111111}:root{--forest:#ff5a1f} @media(max-width:760px){.brand span,.brand img,.app-actions .share,.app-actions .install,.site-home{display:none}.app-actions button{font-size:10px;padding:8px}.brand strong{font-size:13px}.app-actions{gap:3px}.app-header{padding:0 10px}} </style>''')
    app=app.replace('</html>','<script>'+(ROOT/'src/site_bridge.js').read_text(encoding='utf8')+'</script></html>')
    (D/'configurador.html').write_text(app,encoding='utf8')
app=app.replace('STUDIO BURGER','LAB KITCHEN').replace('Studio Burger','Lab Kitchen')
if 'src="./configurator-ui.js"' not in app:
    app=app.replace('</style>','</style><link rel="stylesheet" href="./configurator-ui.css"><link rel="stylesheet" href="./order-ui.css">')
    app=app.replace('</html>','<script src="./configurator-ui.js"></script><script src="./order-ui.js"></script></html>')
# Replace the original AR implementation while keeping the established global hooks.
ar_start=app.index('let spaceViewer,spaceModulePromise')
ar_end=app.index('window.TotemSpace=',ar_start)
ar_end=app.index(';',ar_end)+1
app=app[:ar_start]+(ROOT/'src/ar-experience.js').read_text(encoding='utf8')+app[ar_end:]
if 'href="./ar-experience.css"' not in app:
    app=app.replace('<link rel="stylesheet" href="./order-ui.css">','<link rel="stylesheet" href="./order-ui.css"><link rel="stylesheet" href="./ar-experience.css">')
(D/'configurador.html').write_text(app,encoding='utf8')
site=(D.parent/'src/site.html').read_text(encoding='utf8')
story='''<section id="design-story" class="story-section"><div class="wrap story-grid"><div class="story-scene"><div class="story-top"><span>DESIGN EM MOVIMENTO</span><span id="story-count">01 / 03</span></div><model-viewer id="story-model" alt="Totem Slim em diferentes vistas e acabamentos conforme a rolagem" camera-orbit="-35deg 80deg auto" shadow-intensity="1" environment-image="neutral" interaction-prompt="none" interpolation-decay="180" exposure="1.1"></model-viewer><span class="story-caption" id="story-caption">A sua identidade, em cada detalhe.</span><span class="story-scroll">CONTINUE ROLANDO ↓</span></div><div class="story-chapters"><article data-chapter="0"><span class="eyebrow">01 / Presença</span><h2>Feito para fazer<br>parte do seu espaço.</h2><p>Uma estrutura que acompanha a identidade do negócio. Experimente madeira branca ou acrílico e encontre a cor da sua marca.</p><a href="#laboratorio" class="text-button">Explorar os acabamentos ↗</a></article><article data-chapter="1"><span class="eyebrow">02 / Experiência</span><h2>O próximo pedido<br>começa com<br>um toque.</h2><p>Catálogo, adicionais e fechamento do pedido na tela. Experimente o percurso completo e veja o comprovante sair do totem.</p><a href="#laboratorio" class="text-button">Testar a experiência ↗</a></article><article data-chapter="2"><span class="eyebrow">03 / Construção</span><h2>Um bom projeto<br>vai além da frente.</h2><p>Conexões, ventilação, acesso técnico e espaço para os componentes. Explore a construção em 3D, inclusive em uma vista de camadas.</p><a href="#laboratorio" class="text-button">Conhecer por dentro ↗</a></article></div></div></section>'''
site=site.replace('<section id="laboratorio"',story+'<section id="laboratorio"')
site=site.replace('<body>','<body><div id="scroll-progress" aria-hidden="true"></div>')
(D/'index.html').write_text(site,encoding='utf8')
css=(D/'site.css').read_text(encoding='utf8').replace("@import url('');\n",'').replace('radial-gradient(ellipse at 50% 37%,#e8e3d8 10%,#e8e3d8 70%,#e8e3d8)','#e8e3d8').replace('radial-gradient(ellipse at 30% 50%,#e8e3d8,#e8e3d8)','#e8e3d8')
(D/'site.css').write_text(css,encoding='utf8')
(D/'brand.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#ff5a1f"/><path d="M21 12h25l-4 35H21z" fill="#fff"/><path d="M25 17h16l-2 21H25z" fill="#ff5a1f"/><path d="M20 49h25v4H20z" fill="#fff"/></svg>',encoding='utf8')
manifest=json.loads((D/'manifest.webmanifest').read_text(encoding='utf8'));manifest.update(name='TotemLab — Totens e serviços',short_name='TotemLab',description='Explore, configure e planeje seu totem.',theme_color='#ff5a1f',start_url='./')
(D/'manifest.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf8')
(D/'sw.js').write_text("""const CACHE='totemlab-v7-space';self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(async()=>await caches.match(e.request)||new Response('Sem conexão. Conecte-se para abrir o TotemLab.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})));return}});""",encoding='utf8')
print('TotemLab site + configurador integrados')
