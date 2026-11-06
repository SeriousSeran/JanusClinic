import type { ReactNode } from 'react';
import type { Offering } from '../lib/types';
import { wellnessOfferings, regularValue, money } from '../lib/catalog';
import { BookLink, asset } from '../ui';
import source from '../data/wellness.json';
import './wellness.css';
import TreatmentImage from '../TreatmentImage';

const categories = [
  { name: 'Restore', text: 'Explore massage and foot care, with your comfort in mind.' },
  { name: 'Relax', text: 'Find a moment for massage, sauna and quieter rituals.' },
  { name: 'Contour', text: 'Explore area sessions and programmes, starting with assessment.' },
  { name: 'Renew', text: 'Begin with a conversation about the care that suits you.' },
];
const packages = wellnessOfferings.filter(o => o.kind === 'package');
const memberships = wellnessOfferings.filter(o => o.kind === 'membership');
const programmes = wellnessOfferings.filter(o => o.kind === 'programme');
const sourceById = new Map(source.map(o => [o.id, o]));
function Inclusions({ offering }: { offering: Offering }) {
  return <ul className="wellness-inclusions">{offering.inclusions?.map(i => <li key={i.id}>{i.quantity > 1 ? `${i.quantity} × ` : ''}{sourceById.get(i.id)?.name ?? 'Session'}</li>)}</ul>;
}
function Value({ offering }: { offering: Offering }) {
  const value = regularValue(offering);
  return <p className="wellness-value">Regular value {money(value)} · Save {money(value - offering.price)}</p>;
}
function OfferingCard({ offering }: { offering: Offering }) {
  return <article className="offering-card wellness-card">
    <TreatmentImage offering={offering} />
    <p className="eyebrow">{offering.tier ? `${offering.tier} · monthly` : offering.category}</p>
    <h3>{offering.name}</h3><p>{offering.description}</p>
    <p className="price">{money(offering.price)}{offering.kind === 'membership' && <span className="wellness-period"> / month</span>}</p>
    <Value offering={offering} />
    {offering.reviewNote && <p className="muted wellness-note">{offering.reviewNote}</p>}
    <details className="wellness-card-details"><summary>View details <span className="wellness-sr-only">for {offering.name}</span></summary>
      <h4>Included {offering.kind === 'membership' ? 'each month' : 'in this selection'}</h4><Inclusions offering={offering} />
      <p>Session durations and the visit structure are pending clinic confirmation. Discuss suitability, precautions and aftercare during assessment.</p>
      {offering.category === 'Contour' && <p>Cavitation areas are selected after assessment; no specific area is required by this selection.</p>}
      <p>{offering.kind === 'membership' ? 'Priority booking is included. Membership expiry, carry-forward, cancellation and refund policies remain pending approval.' : 'Package validity and session scheduling remain pending confirmation.'}</p>
      <BookLink id={offering.id} className="secondary">Select {offering.name} in demo</BookLink>
    </details>
    <BookLink id={offering.id} className="secondary">{offering.kind === 'membership' ? `Explore ${offering.name} in demo` : `Select ${offering.name} in demo`}</BookLink>
  </article>;
}
function SectionHeading({ number, title, children }: { number: string; title: string; children?: ReactNode }) {
  return <div className="wellness-section-heading"><div><p className="eyebrow">{number} · Wellness Collection</p><h2>{title}</h2></div>{children && <p>{children}</p>}</div>;
}

export default function Wellness() {
  return <div className="wellness-page">
    <nav className="container wellness-subnav" aria-label="Wellness Collection navigation">
      <a href="#overview">Overview</a><a href="#treatments">Treatments</a><a href="#packages">Packages</a><a href="#memberships">Memberships</a><a href="#body-contouring">Body Contouring</a><a href="#facilities">Facilities</a><a href="#booking">Book Now</a>
    </nav>
    <section className="hero container wellness-hero" id="overview" aria-labelledby="wellness-title">
      <div><p className="eyebrow">Janus Wellness Collection</p><h1 id="wellness-title">The Wellness <br /><em>Collection</em></h1><p className="wellness-tagline">Your Time. Your Body. Your Balance.</p><p className="eyebrow">Restore · Relax · Contour · Renew</p>
        <p>Explore individual treatments from LKR 1,500, signature packages and monthly memberships. Begin with what feels right for you.</p>
        <div className="button-row"><a className="primary" href="#treatments">Explore the collection</a><BookLink id="wellness-assessment" className="secondary">Free assessment · demo</BookLink></div>
        <p className="muted wellness-note">Customer preview · booking selections are demonstrations, not confirmed appointments.</p>
      </div>
      <figure><img src={asset('/images/clinic/dsc-001.jpg')} alt="Interior of the Janus clinic" width="1000" height="800" /><figcaption>Inside Janus · original clinic photography</figcaption></figure>
    </section>

    <section className="section surface" aria-labelledby="wellness-introduction"><div className="container wellness-intro"><p className="eyebrow">01 · A little room for yourself</p><h2 id="wellness-introduction">Care at your own pace.</h2><p>From a single foot massage to a considered monthly routine, the collection gives you space to explore your options. A complimentary initial assessment helps you discuss your goals and treatment suitability before choosing.</p><p className="muted">All prices are in Sri Lankan rupees. Treatment durations and some session details are awaiting clinic confirmation.</p></div></section>

    <section className="section container" aria-label="Wellness categories"><SectionHeading number="02" title="Four ways to find your balance." />
      <nav aria-label="Wellness categories" className="wellness-category-grid">{categories.map((category, index) => <a key={category.name} className="wellness-category" href={category.name === 'Renew' ? '#wellness-assessment' : `#treatments-${category.name.toLowerCase()}`}><span className="eyebrow">0{index + 1}</span><h3>{category.name} <span aria-hidden="true">→</span></h3><p>{category.text}</p></a>)}</nav>
    </section>

    <section className="section surface" id="treatments" aria-labelledby="wellness-services-title"><div className="container"><div className="wellness-section-heading"><div><p className="eyebrow">03 · Individual treatments</p><h2 id="wellness-services-title">Choose your moment.</h2></div><p>Open a service for details and a demo booking selection. Durations are pending confirmation.</p></div>
      <div className="wellness-service-columns">{categories.filter(c => c.name !== 'Renew').map(category => <div key={category.name} id={`treatments-${category.name.toLowerCase()}`} className="wellness-service-group"><h3>{category.name}</h3>{wellnessOfferings.filter(o => o.kind === 'treatment' && o.category === category.name).map(o => <article className="wellness-treatment" key={o.id}><TreatmentImage offering={o}/><details className="wellness-service"><summary><span>{o.name}</span><span>{money(o.price, o.maxPrice)}</span></summary><div className="wellness-service-body"><p>{o.description}</p><dl className="wellness-service-facts"><div><dt>Duration</dt><dd>Pending clinic confirmation</dd></div><div><dt>Suitable for</dt><dd>Discuss during assessment</dd></div><div><dt>Precautions</dt><dd>Discuss during assessment</dd></div><div><dt>Aftercare</dt><dd>Discuss during assessment</dd></div>{o.providerLabel && <div><dt>Provider</dt><dd>{o.providerLabel}</dd></div>}</dl>{o.reviewNote && <p className="muted">{o.reviewNote}</p>}<BookLink id={o.id} className="secondary">Select {o.name} in demo</BookLink></div></details></article>)}</div>)}</div>
    </div></section>

    <section className="section container" id="packages" aria-labelledby="wellness-packages-title"><div className="wellness-section-heading"><div><p className="eyebrow">04 · Signature packages</p><h2 id="wellness-packages-title">A ritual, brought together.</h2></div><p>Five combinations with clear inclusions and approved package prices. Package validity and session scheduling are pending confirmation.</p></div><div className="offering-grid wellness-package-grid">{packages.map(o => <OfferingCard key={o.id} offering={o} />)}</div></section>

    <section className="section surface" id="memberships" aria-labelledby="wellness-memberships-title"><div className="container"><div className="wellness-section-heading"><div><p className="eyebrow">05 · Monthly memberships</p><h2 id="wellness-memberships-title">Make space, each month.</h2></div><p>Three monthly options, each including priority booking. The demo lets you explore a selection; it does not activate a membership or take payment.</p></div><div className="offering-grid">{memberships.map(o => <OfferingCard key={o.id} offering={o} />)}</div>
      <div className="wellness-table-scroll" role="region" aria-label="Membership comparison" tabIndex={0}><table className="wellness-comparison"><caption>Compare monthly memberships</caption><thead><tr><th scope="col">Included each month</th>{memberships.map(o => <th key={o.id} scope="col">{o.name}<br /><span>{o.tier}</span></th>)}</tr></thead><tbody>{['wellness-pain-relief','wellness-relax','wellness-elixir','wellness-lymphatic','wellness-foot','wellness-sauna','wellness-vibration'].map(id => <tr key={id}><th scope="row">{sourceById.get(id)?.name}</th>{memberships.map(o => <td key={o.id}>{o.inclusions?.some(i => i.id === id) ? '1 session' : '—'}</td>)}</tr>)}<tr><th scope="row">Priority booking</th>{memberships.map(o => <td key={o.id}>Included</td>)}</tr><tr><th scope="row">Monthly price</th>{memberships.map(o => <td key={o.id}>{money(o.price)}</td>)}</tr></tbody></table></div>
      <p className="muted wellness-policy">Membership expiry, carry-forward, cancellation and refund policies remain pending approval. Priority booking does not guarantee an appointment slot.</p>
    </div></section>

    <section className="section container" id="body-contouring" aria-labelledby="wellness-contour-title"><div className="wellness-section-heading"><div><p className="eyebrow">06 · Contour programmes</p><h2 id="wellness-contour-title">Start with understanding.</h2></div><p>Cavitation area sessions are LKR 5,000 each. Programme areas are selected after assessment; the clinic confirms suitability and the session plan.</p></div><div className="offering-grid">{[packages.find(o => o.id === 'contour-starter')!, ...programmes].map(o => <OfferingCard key={o.id} offering={o} />)}</div><p className="muted wellness-note">Contour Discovery and Contour Starter are the same two-session product. Fat freezing is separate, at LKR 12,000–15,000 following assessment. No outcomes are guaranteed.</p></section>

    <section className="section wellness-assessment-section" id="wellness-assessment" aria-labelledby="wellness-assessment-title"><div className="container wellness-assessment-layout"><div><p className="eyebrow">07 · Complimentary assessment</p><h2 id="wellness-assessment-title">A conversation is a good place to begin.</h2><p>Your initial assessment is free and independently bookable. Discuss your goals, questions and treatment suitability without choosing a paid service.</p><p className="muted">Duration, availability and follow-up terms are pending confirmation.</p></div><div><TreatmentImage offering={wellnessOfferings.find(o => o.id === 'wellness-assessment')!}/><p className="price">LKR 0</p><BookLink id="wellness-assessment" className="primary">Select free assessment in demo</BookLink></div></div></section>

    <section className="section container" id="facilities" aria-labelledby="wellness-facilities-title"><div className="wellness-section-heading"><div><p className="eyebrow">08 · The Janus setting</p><h2 id="wellness-facilities-title">A glimpse inside the clinic.</h2></div><p>Original Janus clinic photography. Dedicated Wellness room, sauna and equipment photographs are still pending; this image shows the clinic setting.</p></div><figure className="wellness-facility"><img src={asset('/images/clinic/salon-1.png')} alt="Existing salon area within the Janus clinic" loading="lazy" width="1200" height="800" /><figcaption>Existing salon area at Janus · Wellness facility photographs pending</figcaption></figure></section>

    <section className="section surface" aria-labelledby="wellness-how-title"><div className="container"><div className="wellness-section-heading"><div><p className="eyebrow">09 · How it works</p><h2 id="wellness-how-title">From browsing to a considered choice.</h2></div></div><ol className="wellness-steps"><li><span className="eyebrow">01 · Explore</span><h3>Browse freely.</h3><p>Read individual services, compare memberships or begin with a free assessment.</p></li><li><span className="eyebrow">02 · Select</span><h3>Try the demo journey.</h3><p>Your chosen service follows you into the shared demo customer and booking flow. Use fictional details.</p></li><li><span className="eyebrow">03 · Review</span><h3>Check your preferences.</h3><p>Review the selection and preferred date and time in Sri Lanka time. This preview sends no appointment request.</p></li></ol></div></section>

    <section className="section container wellness-faq" aria-labelledby="wellness-faq-title"><div className="wellness-section-heading"><div><p className="eyebrow">10 · Before you choose</p><h2 id="wellness-faq-title">A few useful answers.</h2></div></div>
      <details><summary>Can I book only the free assessment?</summary><p>Yes. The complimentary initial assessment stands alone and requires no paid treatment or package selection. In this preview, its booking flow is a demonstration.</p></details>
      <details><summary>How long does each service take?</summary><p>Wellness treatment durations have not yet been confirmed. The clinic will provide session details before a live booking.</p></details>
      <details><summary>Is the Wellness foot massage the same as Salon?</summary><p>No. The Wellness Foot Massage is LKR 4,000, with duration pending, and is performed by a different provider. Salon Foot Massage is LKR 5,000 for 60 minutes.</p></details>
      <details><summary>Can I carry forward sessions, cancel or get a refund?</summary><p>Membership carry-forward, expiry, cancellation and refund policies are pending approval. Package validity and gift-voucher terms are also pending; the preview does not promise these benefits.</p></details>
      <details><summary>What are Detox and Elixir massages?</summary><p>These are supplied service names. Their techniques and detailed inclusions await clinic confirmation. No toxin-removal or medical outcome claims are made.</p></details>
      <details><summary>How do I know which contour option is suitable?</summary><p>Start with an assessment. The clinic determines suitability and discusses areas and session planning. Fat freezing has a separate assessment-dependent price of LKR 12,000–15,000.</p></details>
      <details><summary>Does this preview confirm appointments or activate memberships?</summary><p>No. It uses local, temporary demo information and sends no messages, takes no payment and creates no real appointment or membership.</p></details>
    </section>

    <section className="section surface" id="booking" aria-labelledby="wellness-final-title"><div className="container wellness-final"><p className="eyebrow">11 · Your next moment</p><h2 id="wellness-final-title">Begin with your questions.</h2><p>Explore the collection or try a standalone free assessment in the customer preview.</p><div className="button-row"><BookLink id="wellness-assessment" className="primary">Free assessment · demo</BookLink><a className="secondary" href="#treatments">Back to treatments</a></div></div></section>
  </div>;
}
