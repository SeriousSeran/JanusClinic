import './home-social.css';
const profiles=[
 {name:'Dr. Jayaruwan Bandara',handle:'@dr.jayaruwanbandara',href:'https://www.instagram.com/dr.jayaruwanbandara/',label:'The person behind your care'},
 {name:'Janus Clinic',handle:'@janus_clinic',href:'https://www.instagram.com/janus_clinic/',label:'The world of Janus'},
];
export default function HomeSocial(){
 return <section className="home-social container" aria-labelledby="home-social-title"><div className="home-social-heading"><div><p className="eyebrow">Stay connected / Instagram</p><h2 id="home-social-title">A little closer<br/>to <em>Janus.</em></h2></div><p>Find Dr. Bandara and Janus Clinic on Instagram.<span>Each profile opens in a new tab.</span></p></div><div className="home-social-links">{profiles.map(p=><a key={p.href} className="home-social-link" href={p.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${p.name} on Instagram, ${p.handle} (opens in a new tab)`}><span className="home-social-icon" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.6"/><circle cx="17.5" cy="6.7" r="1" fill="currentColor"/></svg></span><span className="home-social-copy"><span className="home-social-label">{p.label}</span><strong>{p.name}</strong><span className="home-social-handle">{p.handle}</span></span><span className="home-social-arrow" aria-hidden="true">↗</span></a>)}</div></section>;
}
