import { useEffect } from 'react';
import { SearchField } from 'glisse';
import AreaHero from '../AreaHero';
import {salonOfferings,money} from '../lib/catalog';
import {groupSalonOfferings} from '../lib/salon-families';
import {useCatalogFilters} from '../lib/useCatalogFilters';
import source from '../../content/salon/catalog.draft.json';
import {asset,BookLink} from '../ui';
import TreatmentImage from '../TreatmentImage';

const categories=source.categories;
export default function Salon(){
 const filters=useCatalogFilters(categories.map(c=>c.id));
 const q=filters.q.toLowerCase().trim();
 const filtered=salonOfferings.filter(o=>(filters.category==='all'||categories.find(c=>c.label===o.category)?.id===filters.category)&&`${o.name} ${o.category}`.toLowerCase().includes(q));
 function chooseCategory(id:string){filters.setCategory(id);requestAnimationFrame(()=>document.getElementById('catalog-'+id)?.scrollIntoView({block:'start'}));}
 useEffect(()=>{const id=window.location.hash.slice(1);if(id.startsWith('catalog-')){const target=document.getElementById(id) as HTMLDetailsElement|null;if(target){target.open=true;target.scrollIntoView({block:'start'});}}},[]);
 return <><AreaHero area="salon" description="Everyday rituals. Special occasions. Hair, beauty and body care, with space to be yourself."/>
 <section id="salon-catalog" className="section container"><div className="section-intro"><div><h2>A little time, just for you.</h2><p>Explore all 123 services. Current LKR prices confirmed by the owner on 26 October 2026.</p></div><a href={asset('/site/assets/salon-catalog.jpg')} target="_blank" rel="noreferrer" className="text-link">View original salon catalog photograph →</a></div>
 <label className="search-label">Search salon services<SearchField aria-label="Search salon services" value={filters.q} onValueChange={filters.setQuery} placeholder="Hair, massage, facial…"/></label>
 <p role="status">{filtered.length} of 123 services{filters.category!=='all'?` · ${categories.find(c=>c.id===filters.category)?.label}`:''}</p>
 <nav className="category-navigation" aria-label="Salon service categories"><a href={asset('/salon/#salon-catalog')} aria-current={filters.category==='all'?'page':undefined} onClick={e=>{e.preventDefault();filters.setCategory('all');}}>All services</a>{categories.map(c=>{const params=new URLSearchParams();params.set('category',c.id);if(filters.q)params.set('q',filters.q);return <a href={asset('/salon/?'+params+'#catalog-'+c.id)} key={c.id} aria-current={filters.category===c.id?'page':undefined} onClick={e=>{e.preventDefault();chooseCategory(c.id);}}>{c.label}</a>;})}</nav>
 <button className="text-link filter-clear" onClick={filters.clear}>Clear filters</button>
 {filtered.length===0&&<p>No matching services. Try another name or clear the filters.</p>}
 <div className="catalog-grid">{categories.map(category=>{
  const entries=filtered.filter(o=>o.category===category.label);if(!entries.length)return null;
  const groups=groupSalonOfferings(entries);
  return <details className="catalog-category" id={'catalog-'+category.id} key={category.id} open={Boolean(q)||filters.category===category.id?true:undefined}><summary><span className="category-name">{category.label}</span><span aria-hidden="true">+</span></summary>
   <table><caption className="sr-only">{category.label} prices in LKR</caption><thead><tr><th>Service</th><th>LKR</th><th><span className="sr-only">Booking</span></th></tr></thead>
    {groups.map(group=>{const selected=group.variants.find(o=>o.id===filters.variant)?.id||group.variants[0].id;return <tbody key={group.key} data-family-id={group.key}>
     {group.variants.length>1&&<tr className="salon-variant-selector"><th colSpan={3}><label>{group.name}<select aria-label={'Variant for '+group.name} value={selected} onChange={e=>filters.setVariant(e.target.value)}>{group.variants.map(o=><option key={o.id} value={o.id}>{o.name.match(/\s[–-]\s(.+)$/)?.[1]||o.name} · {money(o.price)}</option>)}</select></label></th></tr>}
     {group.variants.map(o=><tr data-service-id={o.id} key={o.id} hidden={o.id!==selected}><th scope="row"><div className="salon-service"><TreatmentImage offering={o} compact/><div className="salon-service-name">{o.name}{o.duration&&<small>{o.duration} min</small>}{o.reviewNote&&<small>Wording to confirm: {o.reviewNote}</small>}{o.id==='beauty-028'&&<small>Salon therapist · distinct from Wellness foot massage</small>}</div></div></th><td>{new Intl.NumberFormat('en-LK').format(o.price)}</td><td><BookLink id={o.id} className="catalog-book">Book<span className="sr-only"> {o.name}</span></BookLink></td></tr>)}
    </tbody>;})}
   </table>
  </details>;
 })}</div>
 <aside className="price-conditions"><h3>A note on prices</h3><p>Hair-colour prices vary with colour and style. Hair-treatment prices depend on thickness and volume.</p><p>Early-morning full dressing before 08:30 am: additional LKR 2,000.</p><p className="muted">Six printed names remain marked for wording confirmation; their prices are owner-confirmed.</p></aside>
 </section></>;
}
