import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const articles=JSON.parse(read('frontend/data/journal.json'));
test('all eight Journal stories retain published metadata and current image assignments',()=>{
 assert.equal(articles.length,8);
 const images=JSON.parse(read('site/imagery.json')).replacements;
 for(const a of articles){
  const source=read(a.source);
  const json=[...source.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(m=>JSON.parse(m[1]));
  const article=json.find(x=>x['@type']==='Article');assert.ok(article,a.slug);
  assert.equal(a.title,article.headline);assert.equal(a.description,article.description);assert.equal(a.date,article.datePublished);
  const original=new URL(article.image).pathname;assert.equal(a.image,images[original]||original);
  assert.ok(existsSync(new URL((a.image.startsWith('/site/')?'':'public/')+a.image.slice(1),root)),a.image);
  assert.doesNotMatch(a.body,/<script|<iframe|on\w+=|javascript:|<img/i);
  a.sections.forEach((_,i)=>assert.ok(a.body.includes('id="journal-section-'+i+'"')));
 }
});
test('article body extraction preserves original prose text',()=>{
 const result=spawnSync('python3',['-c',`
import json,re,html
from pathlib import Path
from html.parser import HTMLParser
class Prose(HTMLParser):
 def __init__(self):super().__init__();self.depth=0;self.text=[]
 def handle_starttag(self,t,a):
  if t=='div':
   if self.depth:self.depth+=1
   elif dict(a).get('class')=='prose-janus':self.depth=1
 def handle_endtag(self,t):
  if t=='div' and self.depth:self.depth-=1
 def handle_data(self,s):
  if self.depth:self.text.append(s)
def norm(s):return re.sub(r'\\s+',' ',html.unescape(re.sub('<[^>]+>','',s))).strip()
for a in json.loads(Path('frontend/data/journal.json').read_text()):
 p=Prose();p.feed(Path(a['source']).read_text())
 assert norm(''.join(p.text))==norm(a['body']),a['slug']
`],{cwd:root,encoding:'utf8'});assert.equal(result.status,0,result.stderr);
});
test('Journal index and every story export at existing URLs and the dropdown ends with Journal',()=>{
 for(const path of ['journal',...articles.map(a=>'journal/'+a.slug)])assert.match(read('dist/JanusClinic/'+path+'/index.html'),/\/JanusClinic\/site\/app\/index-/);
 assert.match(read('frontend/App.tsx'),/<Link to="\/journal\/">Journal<\/Link><\/nav>}/);
});
