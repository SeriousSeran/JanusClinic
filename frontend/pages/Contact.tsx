import { useEffect, useRef, useState } from 'react';
import { Link } from '../ui';
import clinic from '../data/clinic.json';
import './contact.css';

function Pin({className=''}:{className?:string}) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/></svg>;
}

export default function Contact() {
  const root=useRef<HTMLDivElement>(null);
  const mapFrame=useRef<HTMLIFrameElement>(null);
  const [mapLoaded,setMapLoaded]=useState(false);
  const [hoursHighlighted,setHoursHighlighted]=useState(false);
  const query=encodeURIComponent(clinic.mapsQuery);
  const maps=`https://www.google.com/maps/search/?api=1&query=${query}`;
  useEffect(()=>{if(mapLoaded)mapFrame.current?.focus({preventScroll:true});},[mapLoaded]);

  useEffect(()=>{
    if(typeof IntersectionObserver==='undefined') return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('contact-arrived');observer.unobserve(entry.target);}
    }),{threshold:.08});
    root.current?.querySelectorAll('[data-contact-chapter]').forEach(section=>observer.observe(section));
    return()=>observer.disconnect();
  },[]);

  return <div className="contact-story" ref={root}>
    <section className="contact-hero contact-section" aria-labelledby="contact-title">
      <div className="contact-hero-copy">
        <p className="eyebrow">Contact &amp; booking · Janus Estheti Clinique</p>
        <h1 id="contact-title">Your next chapter.<br/><em>A conversation away.</em></h1>
        <p className="contact-lead">A question, a little guidance, or time just for you. Let’s find the right place to begin.</p>
        <p>Get to know us, plan your visit, or take the next step towards care that feels personal to you.</p>
        <div className="contact-actions"><Link to="/book/" className="contact-primary">Register / Sign in to book <span aria-hidden="true">↗</span></Link><a href="#find-janus" className="contact-text-link">Find your way to Janus <span aria-hidden="true">↓</span></a></div>
        <p className="contact-demo-note">Booking preview · use fictional details. No appointment is created.</p>
      </div>
      <aside className="contact-welcome" aria-labelledby="contact-welcome-title">
        <svg className="contact-contours" viewBox="0 0 400 480" fill="none" aria-hidden="true"><path d="M-50 370C220 470 80 20 430 80M-70 330C180 430 100-20 450 40M-90 290C140 390 120-60 470 0M-30 410C260 510 60 60 410 120"/></svg>
        <div className="contact-welcome-top"><span className="eyebrow">Your visit begins here</span><Pin/></div>
        <div className="contact-welcome-copy"><span className="contact-welcome-number" aria-hidden="true">01</span><h2 id="contact-welcome-title">A little space.<br/><em>For you.</em></h2><address>{clinic.address}</address><a href="#find-janus" className="contact-text-link">Explore the location <span aria-hidden="true">↓</span></a></div>
        <div className={`contact-hours${hoursHighlighted?' hours-highlighted':''}`} role="button" tabIndex={0} aria-label="Highlight opening hours" aria-pressed={hoursHighlighted} onClick={()=>setHoursHighlighted(value=>!value)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setHoursHighlighted(value=>!value);}}}><p className="eyebrow">Plan your time</p>{clinic.hours.map(hours=><p key={hours}>{hours}</p>)}<small>{clinic.hoursStatus}</small></div>
      </aside>
    </section>

    <section className="contact-reach contact-section" data-contact-chapter aria-labelledby="contact-reach-title">
      <div className="contact-section-intro"><p className="eyebrow">01 / Let’s connect</p><h2 id="contact-reach-title">However you begin,<br/><em>we’re here to listen.</em></h2><p>Speak to us about a visit, send a question, or explore booking when you’re ready.</p></div>
      <div className="contact-methods">
        <a href={`tel:${clinic.phone}`} className="contact-method"><span className="contact-method-label">01 / A conversation</span><h3>Give us a call.</h3><span className="contact-method-value">{clinic.phoneDisplay}</span><span className="contact-method-bottom">Talk through your next step <span aria-hidden="true">↗</span></span></a>
        <a href={`mailto:${clinic.email}`} className="contact-method"><span className="contact-method-label">02 / A little detail</span><h3>Write to Janus.</h3><span className="contact-method-value">{clinic.email}</span><span className="contact-method-bottom">Open your email app <span aria-hidden="true">↗</span></span></a>
        <a href={clinic.googlePlaceUrl} target="_blank" rel="noopener noreferrer" className="contact-method"><span className="contact-method-label">03 / A place to begin</span><h3>Come find us.</h3><span className="contact-method-value">{clinic.address}</span><span className="contact-method-bottom">View our Google listing <span aria-hidden="true">↗</span></span></a>
      </div>
    </section>

    <section id="find-janus" className="contact-location" data-contact-chapter aria-labelledby="contact-location-title">
      <div className="contact-section contact-location-heading"><div><p className="eyebrow">02 / Find your way</p><h2 id="contact-location-title">A destination for care.<br/><em>A moment for yourself.</em></h2></div><div><address><Pin/>{clinic.address}</address><p>Please call to confirm your visit and the clinic entrance before travelling.</p><a href={maps} target="_blank" rel="noopener noreferrer" className="contact-text-link">Open in Google Maps <span aria-hidden="true">↗</span></a></div></div>
      <div className="contact-map-shell">
        {mapLoaded ? <><iframe ref={mapFrame} tabIndex={0} title="Janus clinic location on Google Maps" src={`https://www.google.com/maps?q=${query}&output=embed`} allowFullScreen referrerPolicy="no-referrer-when-downgrade"/><p className="contact-map-fallback">Map not displaying? <a href={maps} target="_blank" rel="noopener noreferrer">Open the location in Google Maps ↗</a></p></> : <div className="contact-map-invitation">
          <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="M-100 550C0 50 290 80 400 320S760 570 850 210 1230-70 1310 180M-100 600C0 100 290 130 400 370S760 620 850 260 1230-20 1310 230M-100 500C0 0 290 30 400 270S760 520 850 160 1230-120 1310 130"/></svg>
          <div className="contact-map-pin"><Pin/><span>JANUS · COLOMBO 08</span></div><h3>Find your way to Janus.</h3><p>Explore the clinic’s location on Google Maps.</p><button type="button" className="contact-primary" onClick={()=>setMapLoaded(true)}>Load Google Maps <span aria-hidden="true">↗</span></button><small>Google Maps loads when you choose. Google’s privacy policy applies.</small>
        </div>}
      </div>
      <p className="contact-map-caption">Map searches the clinic name and published address. <a href={clinic.googlePlaceUrl} target="_blank" rel="noopener noreferrer">View the clinic on Google ↗</a></p>
    </section>

    <section className="contact-next contact-section" data-contact-chapter aria-labelledby="contact-next-title">
      <div><p className="eyebrow">03 / Your next step</p><h2 id="contact-next-title">Ready when<br/><em>you are.</em></h2><p>You don’t need to have every answer. Start by exploring the care you’re interested in, or begin with a complimentary initial consultation.</p><Link to="/book/" className="contact-primary">Register / Sign in to book <span aria-hidden="true">↗</span></Link><p className="contact-demo-note">This design preview uses the existing booking demonstration. No real account or appointment is created.</p></div>
      <ol className="contact-steps"><li><span>01</span><div><h3>A little introduction.</h3><p>Register or sign in to begin your booking journey.</p></div></li><li><span>02</span><div><h3>Care that speaks to you.</h3><p>Explore Cosmetic Care, Salon or Wellness and choose your experience.</p></div></li><li><span>03</span><div><h3>A time to connect.</h3><p>Share your preferred date and time. A preference is not a confirmed appointment.</p></div></li></ol>
    </section>

    <section className="contact-questions contact-section" data-contact-chapter aria-labelledby="contact-questions-title"><div><p className="eyebrow">Before you begin</p><h2 id="contact-questions-title">A few things<br/><em>you may be wondering.</em></h2></div><div className="contact-faq"><details><summary>Not sure which service to choose?</summary><p>You can explore <Link to="/services/">the Janus approach</Link> or begin with a <Link to="/book/?offering=initial-consultation">complimentary initial consultation</Link> to discuss your concerns and suitable options.</p></details><details><summary>How do I start a booking?</summary><p>Choose “Register / Sign in to book” to continue to the existing booking page. In this preview, registration and booking are demonstrations using fictional details only.</p></details><details><summary>What should I check before visiting?</summary><p>Please call {clinic.phoneDisplay} to confirm the published opening hours and clinic entrance. Use the Google listing or map above to plan your route.</p></details></div></section>
    <div className="contact-signoff" aria-hidden="true"><span/>A conversation. A connection. Your Janus journey.<span/></div>
  </div>;
}
