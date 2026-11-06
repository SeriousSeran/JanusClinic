from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json,re,html
root=Path(__file__).resolve().parents[1]
config=json.loads((root/'site/imagery.json').read_text())
class Prose(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=False);self.depth=0;self.raw=[]
 def handle_starttag(self,t,a):
  if self.depth:
   self.raw.append(self.get_starttag_text())
   if t=='div':self.depth+=1
  elif t=='div' and dict(a).get('class')=='prose-janus':self.depth=1
 def handle_endtag(self,t):
  if self.depth:
   if t=='div':self.depth-=1
   if self.depth:self.raw.append('</'+t+'>')
 def handle_data(self,v):
  if self.depth:self.raw.append(html.escape(v))
 def handle_entityref(self,v):
  if self.depth:self.raw.append('&'+v+';')
 def handle_charref(self,v):
  if self.depth:self.raw.append('&#'+v+';')
class Safe(HTMLParser):
 allowed={'p','h2','h3','ul','ol','li','strong','em','a','br','blockquote'}
 def __init__(self):super().__init__();self.out=[];self.headings=[];self.headingText=None
 def handle_starttag(self,t,a):
  if t not in self.allowed:return
  attrs=''
  if t=='a':
   u=urlsplit(dict(a).get('href',''))
   if (not u.netloc or u.hostname in ['janusestheticlinique.com','www.janusestheticlinique.com']) and u.path.startswith('/'):
    attrs=' href="'+html.escape(u.path+('?' + u.query if u.query else '')+('#'+u.fragment if u.fragment else ''),quote=True)+'"'
  if t=='h2':
   self.headingText='';attrs=' id="journal-section-'+str(len(self.headings))+'"'
  self.out.append('<'+t+attrs+'>')
 def handle_endtag(self,t):
  if t in self.allowed:self.out.append('</'+t+'>')
  if t=='h2' and self.headingText is not None:self.headings.append(self.headingText);self.headingText=None
 def handle_data(self,v):
  self.out.append(html.escape(v))
  if self.headingText is not None:self.headingText+=v
items=[]
for p in sorted((root/'public/journal').glob('*/index.html')):
 s=p.read_text();meta=None
 for raw in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',s):
  value=json.loads(raw)
  for obj in value if isinstance(value,list) else [value]:
   if obj.get('@type')=='Article':meta=obj
 assert meta
 extractor=Prose();extractor.feed(s);safe=Safe();safe.feed(''.join(extractor.raw));body=''.join(safe.out)
 assert safe.headings and len(body)>500
 plain=html.unescape(re.sub('<[^>]+>',' ',re.sub(r'<script\b.*?</script>','',s,flags=re.S)))
 m=re.search(r'(Skincare|Treatments|Hair|Body|Expert Tips)\s*·\s*(\d+)\s*min read',plain);assert m,p
 original=urlsplit(meta['image']).path;image=config['replacements'].get(original,original)
 items.append({'slug':p.parent.name,'title':meta['headline'],'description':meta['description'],'date':meta['datePublished'],'category':m[1],'minutes':int(m[2]),'image':image,'alt':config['descriptions'].get(image,'Cinteric Gel product packaging'),'illustration':image in config['descriptions'],'body':body,'sections':safe.headings,'source':'public/journal/'+p.parent.name+'/index.html'})
items.sort(key=lambda x:x['date'],reverse=True)
(root/'frontend/data/journal.json').write_text(json.dumps(items,indent=2,ensure_ascii=False)+'\n')
print('Extracted',len(items),'articles with original prose, dates and current image assignments.')
