import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const root = resolve(process.argv.includes('--dist') ? 'dist' : '.');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.webmanifest':'application/manifest+json','.json':'application/json'};
createServer(async(req,res)=>{
 try{
 const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;}
 const file=(await stat(path)).isDirectory()?resolve(path,'index.html'):path;
 res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});
 res.end(await readFile(file));
 }catch{res.writeHead(404).end('Not found');}
}).listen(Number(process.env.PORT)||4173,'0.0.0.0',()=>console.log('Lea & Sigge: http://localhost:'+(process.env.PORT||4173)));
