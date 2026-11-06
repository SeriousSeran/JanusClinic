import {Link,asset} from './ui';
import content from '../site/content.json';
const areaNames={salon:'Salon',cosmetic:'Cosmetic Care'};
export default function AreaHero({area,description}:{area:'salon'|'cosmetic';description:string}){
 const a=content.areas.find(a=>a.id===area)!;
 return <section className="container area-hero"><div><Link to="/" className="back-link">← All of Janus</Link><p className="eyebrow">{a.eyebrow}</p><h1>{areaNames[area]}.</h1><p className="lead">{description}</p>{area==='salon'&&<a className="primary" href="#salon-catalog">Browse services & prices ↓</a>}</div><figure data-glisse-backdrop><img src={asset(a.image)} alt={a.alt} width="928" height="1152"/><figcaption>AI-generated treatment illustration · not a patient or result</figcaption></figure></section>;
}
