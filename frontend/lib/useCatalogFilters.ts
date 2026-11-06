import { useEffect, useState } from 'react';

/** URL state is the source of truth. Search replaces history; intentional selections push it. */
export function useCatalogFilters(validCategories: readonly string[]) {
 const [search,setSearch]=useState(()=>window.location.search);
 useEffect(()=>{const sync=()=>setSearch(window.location.search);window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync);},[]);
 const params=new URLSearchParams(search);
 const category=validCategories.includes(params.get('category')||'')?params.get('category')!:'all';
 const q=params.get('q')||'';
 const variant=params.get('variant')||'';
 function update(values:Record<string,string>,push=false){
  const url=new URL(window.location.href);
  for(const [key,value] of Object.entries(values)){if(value&&value!=='all')url.searchParams.set(key,value);else url.searchParams.delete(key);}
  const target=url.pathname+url.search+url.hash;
  if(target===window.location.pathname+window.location.search+window.location.hash)return;
  history[push?'pushState':'replaceState']({},'',target);dispatchEvent(new PopStateEvent('popstate'));
 }
 return {q,category,variant,setQuery:(value:string)=>update({q:value}),setCategory:(value:string)=>update({category:value},true),setVariant:(value:string)=>update({variant:value},true),clear:()=>update({q:'',category:'',variant:''},true)};
}
