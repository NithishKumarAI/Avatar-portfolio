import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {gzipSync} from 'node:zlib';
const root=process.cwd();
const files=fs.readdirSync('public',{recursive:true}).filter(p=>fs.statSync(path.join('public',p)).isFile());
const assets=files.map(p=>{const b=fs.readFileSync(path.join('public',p));return {path:p,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')};});
const duplicates=Object.values(Object.groupBy(assets,a=>a.sha256)).filter(a=>a.length>1);
const glbs=assets.filter(a=>a.path.endsWith('.glb')).map(a=>{const b=fs.readFileSync(path.join('public',a.path));const j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());return {path:a.path,bytes:a.bytes,nodes:j.nodes?.length,meshes:j.meshes?.length,images:j.images,skins:j.skins?.map(s=>({joints:s.joints.length})),animations:j.animations?.map(x=>({name:x.name,tracks:x.channels.length})),hips:j.nodes?.filter(n=>n.name?.includes('Hips')),scaleNodes:j.nodes?.filter(n=>n.scale)};});
const bundles=fs.readdirSync('audit-evidence/build/assets').map(p=>{const b=fs.readFileSync('audit-evidence/build/assets/'+p);return {path:p,bytes:b.length,gzipBytes:gzipSync(b).length};});
const inv=JSON.parse(fs.readFileSync('audit-evidence/browser-assets.json','utf8'));
const requests=[];
for(const a of inv){try{const r=await fetch(a.url,{headers:{'Accept-Encoding':'identity'}});const b=Buffer.from(await r.arrayBuffer());requests.push({url:a.url,status:r.status,bodyBytes:b.length,contentLength:r.headers.get('content-length'),contentEncoding:r.headers.get('content-encoding')});}catch(e){requests.push({url:a.url,error:String(e)});}}
const result={note:'Independent HTTP GET replay of browser-observed resource URLs, identity encoding. Not browser HAR, cold load timing, or production wire transfer.',publicBytes:assets.reduce((s,a)=>s+a.bytes,0),assets,duplicates,glbs,bundles,requests,httpReplayBodyBytes:requests.reduce((s,a)=>s+(a.bodyBytes||0),0)};
fs.writeFileSync('audit-evidence/asset-measurements.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,assets:undefined,requests:undefined},null,2));
