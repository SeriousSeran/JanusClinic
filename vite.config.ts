import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({root:'frontend',publicDir:false,build:{outDir:resolve('.build/react'),emptyOutDir:true,assetsDir:'site/app',manifest:true},server:{host:'127.0.0.1'}});
