import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const args=process.argv.slice(2);
const option=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
const preview=args.includes('--preview');
const repository=(process.env.GITHUB_REPOSITORY||'SeriousSeran/JanusClinic').split('/').at(-1);
const base=option('--base-path',preview?'/'+repository:'');
if(base&&!/^\/[\w-]+$/.test(base))throw new Error('Invalid repository prefix');
const output=option('--output',preview?'dist/JanusClinic':'site/generated');
const reactRoot=resolve(preview?'.build/pages':'.build/local');
for(const [cmd,parameters] of [
 ['node',['node_modules/vite/bin/vite.js','build','--base',base+'/','--outDir',reactRoot]],
 ['python3',['scripts/build-preview.py','--base-path',base,'--output',output,'--react-root',reactRoot]],
]){const result=spawnSync(cmd,parameters,{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
