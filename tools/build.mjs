import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of ['index.html','manifest.webmanifest','sw.js','assets','src']) await cp(path, `dist/${path}`, {recursive:true});
console.log('Built dependency-free game in dist/');
