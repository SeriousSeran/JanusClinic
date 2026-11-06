import {useEffect,useState,type AnchorHTMLAttributes,type HTMLAttributes,type ReactNode} from 'react';
import {Glass as GlisseGlass} from 'glisse';
import { bookingHref } from './lib/catalog';
import authoredRoutes from './data/routes.json';
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const asset = (path: string) => base + '/' + path.replace(/^\//, '');
export function Link({to,children,replace=false,...props}:{to:string;children:ReactNode;replace?:boolean}&AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={asset(to)} {...props} onClick={e=>{
    props.onClick?.(e);
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||props.target||props.download) return;
    const path=to.split(/[?#]/)[0];
    const route=path.replace(/\/$/,'')+'/';
    if(!authoredRoutes.includes(route))return;
    e.preventDefault();history[replace?'replaceState':'pushState']({},'',asset(to));dispatchEvent(new PopStateEvent('popstate'));
  }}>{children}</a>;
}
export const BookLink=({id,children='Book this experience',className='primary'}:{id:string;children?:ReactNode;className?:string})=><Link to={bookingHref(id)} className={className}>{children}</Link>;

// Glisse sets inline filter priorities; preference fallbacks must avoid mounting its lens.
export function Glass(props:HTMLAttributes<HTMLDivElement>){
 const query='(prefers-reduced-transparency: reduce), (forced-colors: active)';
 const [solid,setSolid]=useState(()=>matchMedia(query).matches);
 useEffect(()=>{const media=matchMedia(query);const update=()=>setSolid(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 return solid?<div {...props} className={'lg-glass glass-fallback '+(props.className||'')} style={{...props.style,backdropFilter:'none',WebkitBackdropFilter:'none'}}/>:<GlisseGlass {...props}/>;
}
