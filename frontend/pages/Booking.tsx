import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { Area, BookingDraft, OfferingKind } from '../lib/types';
import { allOfferings, offeringPrice } from '../lib/catalog';
import { colomboToday, formatPreferredDate, preferredTimes, validateAppointment } from '../lib/booking';
import type { FieldErrors } from '../lib/booking';
import { useDemoSession } from '../session';
import { Link } from '../ui';
import './booking.css';
import TreatmentImage from '../TreatmentImage';

const bookableOffering = (id: string) => allOfferings.find(item => item.id === id);
const kinds: OfferingKind[] = ['treatment', 'package', 'membership', 'programme', 'assessment'];
type Step = 'appointment' | 'review' | 'confirmation';

export default function Booking({ initialOfferingId }: { initialOfferingId?: string }) {
  const { customer } = useDemoSession();
  const initialOffering = initialOfferingId ? bookableOffering(initialOfferingId) : undefined;
  const [step, setStep] = useState<Step>('appointment');
  const profile=customer!;
  const [draft, setDraft] = useState<BookingDraft>({ offeringId: initialOffering?.id ?? '', date: '', time: '', notes: '' });
  const [area, setArea] = useState<Area|''>(()=>{const area=new URLSearchParams(location.search).get('area');return initialOffering?.area??(['salon','wellness','cosmetic'].includes(area??'')?area as Area:'');});
  const [kind, setKind] = useState(initialOffering?.kind ?? '');
  const [unknownSelection, setUnknownSelection] = useState(Boolean(initialOfferingId && !initialOffering));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [acknowledged, setAcknowledged] = useState(false);
  const [reference, setReference] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousInitial = useRef(initialOfferingId);
  const offering = bookableOffering(draft.offeringId);
  const options = allOfferings.filter(item => (!area || item.area === area) && (!kind || item.kind === kind));

  useEffect(() => {
    if (previousInitial.current === initialOfferingId) return;
    previousInitial.current = initialOfferingId;
    const selected = initialOfferingId ? bookableOffering(initialOfferingId) : undefined;
    setDraft(current => ({ ...current, offeringId: selected?.id ?? '' }));
    setArea(selected?.area ?? '');
    setKind(selected?.kind ?? '');
    setUnknownSelection(Boolean(initialOfferingId && !selected));
    setAcknowledged(false);
    setErrors({});
    if (step === 'confirmation' || step === 'review') setStep('appointment');
  }, [initialOfferingId, customer, step]);

  useEffect(() => { headingRef.current?.focus(); }, [step]);
  useEffect(() => {
    const first = Object.keys(errors)[0];
    if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
  }, [errors]);

  function go(next: Step) { setErrors({}); setStep(next); }
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAppointment(draft);
    if (!offering) nextErrors.offeringId = 'Choose an available offering for this demo.';
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) { setAcknowledged(false); go('review'); }
  }
  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAppointment(draft);
    if (!offering) nextErrors.offeringId = 'Choose an available offering for this demo.';
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setStep('appointment'); return; }
    if (!acknowledged) { setErrors({ acknowledged: 'Acknowledge the demonstration and sample privacy notice to continue.' }); return; }
    setReference(`DEMO-${Date.now().toString(36).toUpperCase()}`);
    go('confirmation');
  }
  function field(name: string, label: string, control: ReactNode, hint?: string) {
    return <div className="field"><label htmlFor={name}>{label}</label>{control}{hint && <small id={`${name}-hint`}>{hint}</small>}{errors[name] && <p id={`${name}-error`} className="error" role="alert">{errors[name]}</p>}</div>;
  }
  function accessibility(name: string, hint = false) {
    return { id: name, name, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': [hint ? `${name}-hint` : '', errors[name] ? `${name}-error` : ''].filter(Boolean).join(' ') || undefined };
  }
  function updateDraft(key: keyof BookingDraft, value: string) { setDraft(current => ({ ...current, [key]: value })); }
  function appointmentSummary() {
    return offering && <dl className="booking-summary">
      <div><dt>Offering</dt><dd>{offering.name}</dd></div>
      <div><dt>Area / provider</dt><dd>{offering.area} · {offering.providerLabel ?? `${offering.area.charAt(0).toUpperCase()}${offering.area.slice(1)} team`}</dd></div>
      <div><dt>{offering.kind === 'membership' ? 'Membership price (enquiry only)' : 'Price'}</dt><dd>{offeringPrice(offering)}{offering.kind === 'membership' ? ' monthly' : ''}</dd></div>
      <div><dt>Preferred date</dt><dd>{draft.date ? formatPreferredDate(draft.date) : 'Not selected'} (Asia/Colombo)</dd></div>
      <div><dt>Preferred time</dt><dd>{draft.time}</dd></div>
      {draft.notes && <div><dt>Sample notes</dt><dd>{draft.notes}</dd></div>}
    </dl>;
  }

  return <section className="container section booking-page" aria-labelledby="booking-title">
    <p className="eyebrow">Customer journey · Demonstration</p>
    <h1 id="booking-title" className="text-h1">Book your experience.</h1><p>Signed in as {customer?.name}. <Link to="/profile/">View or edit your profile →</Link></p>
    <p className="booking-notice"><strong>DEMO ONLY.</strong> Use fictional details. Nothing is sent to the clinic, no appointment is scheduled, and no payment is taken. Details stay only in React memory and reset on refresh.</p>
    {offering && <aside className="booking-context" aria-label="Your selected service"><TreatmentImage offering={offering} compact/><div><span className="eyebrow">Your selection</span><h2>{offering.name}</h2><p>{offeringPrice(offering)}{offering.kind === 'membership' ? ' / month · enquiry only' : ''}{offering.providerLabel ? ` · ${offering.providerLabel}` : ''}</p></div></aside>}
    <ol className="booking-progress" aria-label="Demo booking steps">{['Appointment', 'Review', 'Demo preview'].map((label, index) => <li key={label} aria-current={['appointment', 'review', 'confirmation'][index] === step ? 'step' : undefined}>{index + 1}. {label}</li>)}</ol>
    {unknownSelection && <p className="booking-notice" role="status">The linked offering was not found. Choose an available offering in the appointment picker for this demo.</p>}
    <div className="glass-panel booking-panel">
      <h2 id="booking-current-step" ref={headingRef} tabIndex={-1}>{step === 'appointment' ? 'Appointment preferences' : step === 'review' ? 'Review your demo request' : 'Demo request preview'}</h2>
      {step === 'appointment' && <form ref={formRef} onSubmit={review} noValidate autoComplete="off">
        <p>Welcome, {profile.name || 'Demo customer'}. Choose preferences for a demonstration. Available appointment slots and staff schedules are not connected.</p>
        <div className="form-grid">
          {field('area', 'Area', <select id="area" name="area" value={area} onChange={event => { setArea(event.target.value as Area|''); setKind(''); updateDraft('offeringId', ''); setUnknownSelection(false); }}><option value="">All areas</option><option value="wellness">Wellness</option><option value="salon">Salon</option><option value="cosmetic">Cosmetic</option></select>)}
          {field('kind', 'Offering type', <select id="kind" name="kind" value={kind} onChange={event => { setKind(event.target.value); updateDraft('offeringId', ''); setUnknownSelection(false); }}><option value="">All types</option>{kinds.filter(value => allOfferings.some(item => (!area || item.area === area) && item.kind === value)).map(value => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}</select>)}
          {field('offeringId', 'Offering (required)', <select {...accessibility('offeringId')} value={draft.offeringId} onChange={event => { updateDraft('offeringId', event.target.value); setUnknownSelection(false); }} required><option value="">Choose an offering</option>{options.map(item => <option key={item.id} value={item.id}>{item.name} · {item.area} · {offeringPrice(item)}</option>)}</select>)}
          {field('date', 'Preferred date (required)', <input {...accessibility('date', true)} type="date" min={colomboToday()} value={draft.date} onChange={event => updateDraft('date', event.target.value)} required />, 'Today or later in Asia/Colombo. This is a preference, not an available slot.')}
          {field('time', 'Preferred time (required)', <select {...accessibility('time')} value={draft.time} onChange={event => updateDraft('time', event.target.value)} required><option value="">Choose a time period</option>{preferredTimes.map(value => <option key={value}>{value}</option>)}</select>)}
          {field('notes', 'Fictional notes (optional)', <textarea {...accessibility('notes', true)} value={draft.notes} onChange={event => updateDraft('notes', event.target.value)} rows={3} />, 'Do not enter real medical or sensitive information in this demonstration.')}
        </div>
        {offering && <p className="booking-selection"><strong>{offering.name}</strong> · {offering.area} · {offeringPrice(offering)}{offering.providerLabel && ` · ${offering.providerLabel}`}</p>}
        {offering?.kind === 'membership' && <p className="booking-notice">Membership selections are enquiries only. This demo does not activate a membership or take payment. Policies remain pending approval.</p>}
        <div className="button-row"><button type="submit" className="primary">Review demo request</button><Link to="/profile/" className="secondary">Edit profile</Link></div>
      </form>}
      {step === 'review' && <form ref={formRef} onSubmit={confirm} noValidate>
        <dl className="booking-summary"><div><dt>Fictional customer</dt><dd>{profile.name} · age {profile.age}{profile.gender ? ` · ${profile.gender}` : ''}</dd></div><div><dt>Date of birth</dt><dd>{profile.dateOfBirth}</dd></div><div><dt>Fictional email</dt><dd>{profile.email}</dd></div><div><dt>Fictional phone</dt><dd>{profile.phone}</dd></div></dl>
        {appointmentSummary()}
        <p>This is a local demonstration of a request. Preferences need clinic confirmation in a future live service.{offering?.kind === 'membership' ? ' This membership enquiry does not activate membership or take payment.' : ''}</p>
        <div className="field booking-ack"><label htmlFor="acknowledged"><input {...accessibility('acknowledged')} type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} /> I understand this is a demo, have used fictional details, and acknowledge the sample privacy notice: details stay in React memory until refresh and nothing is sent.</label>{errors.acknowledged && <p className="error" role="alert" id="acknowledged-error">{errors.acknowledged}</p>}</div>
        <div className="button-row"><button type="submit" className="primary">Create demo request preview</button><button type="button" className="secondary" onClick={() => go('appointment')}>Edit appointment</button><Link to="/profile/" className="secondary">Edit profile</Link></div>
      </form>}
      {step === 'confirmation' && <div aria-live="polite">
        <p className="eyebrow">{reference}</p><p><strong>Awaiting clinic confirmation (demonstration)</strong></p>
        <p>No request was sent. No appointment was scheduled. This reference is only a demo preview in this browser session.</p>
        {appointmentSummary()}
        {offering?.kind === 'membership' && <p>No membership has been activated and no payment has been taken.</p>}
        <div className="button-row"><button type="button" className="secondary" onClick={() => { setAcknowledged(false); go('appointment'); }}>Edit demo preferences</button><Link to="/" className="primary">Return to browsing</Link></div>
      </div>}
    </div>
  </section>;
}
