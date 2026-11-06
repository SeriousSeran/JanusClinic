import clinic from './data/clinic.json';
import { asset, Link } from './ui';
export default function ClinicInfo(){return <section className="clinic-info container" aria-labelledby="clinic-info-title">
 <figure><img src={asset(clinic.image)} alt={clinic.imageDescription} width="774" height="1024" loading="lazy" decoding="async"/><figcaption>Published practitioner portrait · {clinic.photographyStatus}</figcaption></figure>
 <div><h2 id="clinic-info-title">Plan your visit.</h2><address>{clinic.address}</address><a className="text-link" href={`tel:${clinic.phone}`}>Call {clinic.phoneDisplay}</a><p className="clinic-hours">{clinic.hours.map(line=><span key={line}>{line}</span>)}</p><p className="muted small">{clinic.hoursStatus}</p><Link to={clinic.sourcePath} className="text-link">Clinic details & directions</Link></div>
 </section>;}
