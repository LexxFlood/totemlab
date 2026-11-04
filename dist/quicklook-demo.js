// Build a native Quick Look animation on top of model-viewer's USDZ export.
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function readStoredUSDZ(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const files = new Map();
  for (let offset = 0; offset + 30 <= bytes.length && view.getUint32(offset, true) === 0x04034b50;) {
    const flags = view.getUint16(offset + 6, true);
    const method = view.getUint16(offset + 8, true);
    const size = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const data = offset + 30 + nameLength + view.getUint16(offset + 28, true);
    if (method !== 0 || (flags & 8) || data + size > bytes.length) throw Error('USDZ inválido');
    files.set(decoder.decode(bytes.subarray(offset + 30, offset + 30 + nameLength)), bytes.subarray(data, data + size));
    offset = data + size;
  }
  return files;
}

function crc32(bytes) {
  let crc = -1;
  for (const value of bytes) {
    crc ^= value;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ -1) >>> 0;
}

function packUSDZ(files) {
  const local = [], directory = [];
  let offset = 0, directorySize = 0;
  for (const [path, bytes] of files) {
    const name = encoder.encode(path);
    const extra = 4 + ((64 - ((offset + 34 + name.length) % 64)) % 64);
    const header = new Uint8Array(30 + name.length + extra);
    const central = new Uint8Array(46 + name.length);
    const h = new DataView(header.buffer), c = new DataView(central.buffer);
    const checksum = crc32(bytes);
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true);
    h.setUint32(14, checksum, true); h.setUint32(18, bytes.length, true); h.setUint32(22, bytes.length, true);
    h.setUint16(26, name.length, true); h.setUint16(28, extra, true);
    header.set(name, 30);
    h.setUint16(30 + name.length, 0x1986, true); h.setUint16(32 + name.length, extra - 4, true);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true);
    c.setUint32(16, checksum, true); c.setUint32(20, bytes.length, true); c.setUint32(24, bytes.length, true);
    c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
    central.set(name, 46);
    local.push(header, bytes); directory.push(central);
    offset += header.length + bytes.length; directorySize += central.length;
  }
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.size, true); end.setUint16(10, files.size, true);
  end.setUint32(12, directorySize, true); end.setUint32(16, offset, true);
  return new Blob([...local, ...directory, end.buffer], {type:'model/vnd.usdz+zip'});
}

async function drawDemoTexture(title, lines, receipt = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = receipt ? '#ffffff' : '#faf7ee'; ctx.fillRect(0, 0, 256, 512);
  ctx.fillStyle = '#a63813'; ctx.font = 'bold 22px sans-serif'; ctx.fillText('LAB KITCHEN', 18, 48);
  ctx.fillStyle = '#241b16'; ctx.font = 'bold 23px sans-serif'; ctx.fillText(title, 18, 125);
  ctx.font = '17px sans-serif';
  lines.forEach((line, i) => ctx.fillText(line, 18, 175 + i*42));
  ctx.font = '12px sans-serif'; ctx.fillText('DEMONSTRAÇÃO', 18, 470);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

function demoMaterial(name, file) {
  return `def Material "${name}" {
    token outputs:surface.connect = </Materials/${name}/Surface.outputs:surface>
    def Shader "Surface" {
      uniform token info:id = "UsdPreviewSurface"
      color3f inputs:diffuseColor.connect = </Materials/${name}/Texture.outputs:rgb>
      token outputs:surface
    }
    def Shader "Texture" {
      uniform token info:id = "UsdUVTexture"
      asset inputs:file = @./${file}@
      float2 inputs:st.connect = </Materials/${name}/UV.outputs:result>
      float3 outputs:rgb
    }
    def Shader "UV" {
      uniform token info:id = "UsdPrimvarReader_float2"
      token inputs:varname = "st"
      float2 outputs:result
    }
  }`;
}

function demoMesh(name, points, samples = '') {
  return `def Mesh "${name}" (prepend apiSchemas = ["MaterialBindingAPI"]) {
    int[] faceVertexCounts = [4]
    int[] faceVertexIndices = [0, 1, 2, 3]
    point3f[] points = [${points.map(point => '('+point.join(',')+')').join(',')}]
    texCoord2f[] primvars:st = [(0,0),(1,0),(1,1),(0,1)] (interpolation = "vertex")
    uniform token subdivisionScheme = "none"
    rel material:binding = </Materials/${name}>
    ${samples}
  }`;
}

function addDemoScene(usd, slim) {
  // The GLB exports this named LCD node with the original model's transforms.
  const screen = /^(\s*)def Xform "(Interface_?de_?autoatendimento(?:_\d+)?)"\s*\(/m.exec(usd);
  if (!screen) throw Error('Visor do totem não encontrado');
  const indent = screen[1].split('\n').at(-1).length;
  const parents = [];
  for (const match of usd.slice(0, screen.index).matchAll(/^([\t ]*)def \w+ "([^"]+)"/gm)) {
    const level = match[1].length;
    while (parents.length && parents.at(-1).level >= level) parents.pop();
    parents.push({level, name:match[2]});
  }
  const parentPath = '/' + parents.filter(p => p.level < indent).map(p => p.name).join('/');
  const w = slim ? .1449745 : .2365, bottom = slim ? 1.2324781 : .829, top = slim ? 1.7575219 : 1.775;
  const bz = slim ? .0748048 : .105, tz = slim ? -.0407048 : .105;
  const quad = [[-w,bottom,bz],[w,bottom,bz],[w,top,tz],[-w,top,tz]];
  const slide = samples => `double3 xformOp:translate.timeSamples = { ${samples} }
    uniform token[] xformOpOrder = ["xformOp:translate"]`;
  const mesh = [
    demoMesh('DemoPayment', quad, slide('0:(0,0,-0.01), 20:(0,0,-0.01), 21:(0,0,0.004)')),
    demoMesh('DemoDone', quad, slide('0:(0,0,-0.012), 48:(0,0,-0.012), 49:(0,0,0.006)')),
    demoMesh('DemoReceipt', (() => {
      const [x,y,z] = slim ? [.094,1.171,.104] : [.157,.733,.105];
      return [[x-.033,y-.105,z],[x+.033,y-.105,z],[x+.033,y,z],[x-.033,y,z]];
    })(), slide('0:(0,0.106,-0.08), 49:(0,0.106,-0.08), 55:(0,0.106,0.04), 82:(0,0,0.04)'))
  ].join('\n');
  const screenSource = usd.slice(screen.index);
  const binding = /rel material:binding = <\/Materials\/[^>]+>/;
  const screenEnd = screenSource.indexOf('}');
  const screenBody = screenSource.slice(0, screenEnd);
  if (screenEnd < 0 || !binding.test(screenBody)) throw Error('Material do visor não encontrado');
  usd = usd.slice(0,screen.index) + '\n' + mesh + '\n' +
    screenBody.replace(binding, 'rel material:binding = </Materials/DemoMenu>') + screenSource.slice(screenEnd);
  usd = usd.replace('upAxis = "Y"', 'upAxis = "Y"\n autoPlay = false\n startTimeCode = 0\n endTimeCode = 95\n timeCodesPerSecond = 30');
  usd = usd.replace(/def "Materials"\s*\{|def Scope "Materials"\s*\{/,
    match => match + '\n' + ['DemoMenu','DemoPayment','DemoDone','DemoReceipt'].map(name => demoMaterial(name,name+'.png')).join('\n'));
  if (!usd.includes('def Material "DemoMenu"')) throw Error('Materiais do modelo não encontrados');
  if (!usd.includes('preliminary:anchoring:type')) {
    usd = usd.replace(/(def Xform "Scene"[^]*?\)\s*\{)/, match => match +
      '\n token preliminary:anchoring:type = "plane"\n token preliminary:planeAnchoring:alignment = "vertical"');
  }
  const path = name => '<'+parentPath+'/'+name+'>';
  return usd + `
def Preliminary_Behavior "TotemOrderDemo" {
  rel triggers = [ <Tap> ]
  rel actions = [ <Play> ]
  def Preliminary_Trigger "Tap" {
    uniform token info:id = "TapGesture"
    rel affectedObjects = [ ${path(screen[2])}, ${path('DemoDone')} ]
  }
  def Preliminary_Action "Play" {
    uniform token info:id = "StartAnimation"
    rel affectedObjects = [ ${['DemoPayment','DemoDone','DemoReceipt'].map(path).join(', ')} ]
  }
}
`;
}

export async function prepareQuickLookDemo(viewer, slim) {
  const original = await viewer.prepareUSDZ();
  if (!original) throw Error('Quick Look não conseguiu exportar o modelo');
  try {
    const bytes = new Uint8Array(await (await fetch(original)).arrayBuffer());
    const files = readStoredUSDZ(bytes);
    const root = files.keys().next().value;
    if (!root?.endsWith('.usda')) throw Error('Cena USDZ incompatível');
    files.set(root, encoder.encode(addDemoScene(decoder.decode(files.get(root)), slim)));
    const textures = [
      ['DemoMenu','Monte seu pedido',['Burger da casa','Toque na tela','para experimentar']],
      ['DemoPayment','Pagamento',['Burger da casa','Cartão · simulação','Confirmando…']],
      ['DemoDone','Pedido confirmado',['Senha 042','Retire sua notinha','na impressora']],
      ['DemoReceipt','Pedido 042',['1× Burger da casa','Pedido de teste','Sem valor fiscal'],true]
    ];
    for (const [name,title,lines,receipt] of textures) files.set(name+'.png', await drawDemoTexture(title,lines,receipt));
    return URL.createObjectURL(packUSDZ(files));
  } finally {
    URL.revokeObjectURL(original);
  }
}
