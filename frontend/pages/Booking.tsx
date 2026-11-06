import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { BookingDraft, DemoCustomer, OfferingKind } from '../lib/types';
import { allOfferings, offeringPrice } from '../lib/catalog';
import { colomboToday, formatPreferredDate, normalizePhone, preferredTimes, validateAppointment, validateCustomer } from '../lib/booking';
import type { FieldErrors } from '../lib/booking';
import { useDemoSession } from '../session';
import { Link } from '../ui';
import './booking.css';
import TreatmentImage from '../TreatmentImage';

const blankCustomer: DemoCustomer = { name: '', age: '', gender: '', phone: '' };
const sampleCustomer: DemoCustomer = { name: 'Demo customer', age: '30', phone: '0770000000', gender: 'Prefer not to say' };
const bookableOffering = (id: string) => allOfferings.find(item => item.id === id);
const kinds: OfferingKind[] = ['treatment', 'package', 'membership', 'programme', 'assessment'];
type Step = 'identify' | 'appointment' | 'review' | 'confirmation';

export default function Booking({ initialOfferingId }: { initialOfferingId?: string }) {
  const { customer, setCustomer } = useDemoSession();
  const initialOffering = initialOfferingId ? bookableOffering(initialOfferingId) : undefined;
  const [step, setStep] = useState<Step>(customer ? 'appointment' : 'identify');
  const [identityMode, setIdentityMode] = useState<'new' | 'existing'>('new');
  const [sampleSelected, setSampleSelected] = useState(false);
  const [profile, setProfile] = useState<DemoCustomer>(customer ?? blankCustomer);
  const [draft, setDraft] = useState<BookingDraft>({ offeringId: initialOffering?.id ?? '', date: '', time: '', notes: '' });
  const [area, setArea] = useState(initialOffering?.area ?? '');
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
    if (step === 'confirmation' || step === 'review') setStep(customer ? 'appointment' : 'identify');
  }, [initialOfferingId, customer, step]);

  useEffect(() => { headingRef.current?.focus(); }, [step]);
  useEffect(() => {
    const first = Object.keys(errors)[0];
    if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
  }, [errors]);

  function go(next: Step) { setErrors({}); setStep(next); }
  function identify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCustomer(profile);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const valid = { ...profile, name: profile.name.trim(), age: profile.age.trim(), phone: normalizePhone(profile.phone)! };
    setProfile(valid); setCustomer(valid); go('appointment');
  }
  function verifySample() {
    const valid = { ...sampleCustomer, phone: normalizePhone(sampleCustomer.phone)! };
    setProfile(valid); setCustomer(valid); go('appointment');
  }
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
  function updateProfile(key: keyof DemoCustomer, value: string) { setProfile(current => ({ ...current, [key]: value })); }
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
    <h1 id="booking-title" className="text-h1">Explore a booking request.</h1>
    <p className="booking-notice"><strong>DEMO ONLY.</strong> Use fictional details. Nothing is sent to the clinic, no appointment is scheduled, and no payment is taken. Details stay only in React memory and reset on refresh.</p>
    {offering && <aside className="booking-context" aria-label="Your selected service"><TreatmentImage offering={offering} compact/><div><span className="eyebrow">Your selection</span><h2>{offering.name}</h2><p>{offeringPrice(offering)}{offering.kind === 'membership' ? ' / month · enquiry only' : ''}{offering.providerLabel ? ` · ${offering.providerLabel}` : ''}</p></div></aside>}
    <ol className="booking-progress" aria-label="Demo booking steps">{['Identify', 'Appointment', 'Review', 'Demo preview'].map((label, index) => <li key={label} aria-current={['identify', 'appointment', 'review', 'confirmation'][index] === step ? 'step' : undefined}>{index + 1}. {label}</li>)}</ol>
    {unknownSelection && <p className="booking-notice" role="status">The linked offering was not found. Choose an available offering in the appointment picker after identifying for this demo.</p>}
    <div className="glass-panel booking-panel">
      <h2 id="booking-current-step" ref={headingRef} tabIndex={-1}>{step === 'identify' ? 'Your demo profile' : step === 'appointment' ? 'Appointment preferences' : step === 'review' ? 'Review your demo request' : 'Demo request preview'}</h2>
      {step === 'identify' && <>
        <p>Browsing is open to everyone. Identification here is a simulation for the booking journey. Use fictional details; this does not create or look up a real account.</p>
        <div className="button-row" role="group" aria-label="Demo customer type">
          <button type="button" className="secondary" aria-pressed={identityMode === 'new'} onClick={() => { setIdentityMode('new'); setErrors({}); }}>New demo customer</button>
          <button type="button" className="secondary" aria-pressed={identityMode === 'existing'} onClick={() => { setIdentityMode('existing'); setErrors({}); }}>Existing demo customer</button>
        </div>
        {identityMode === 'existing' ? <div className="booking-sample"><p>This uses a fixed fictional sample. There is no phone lookup or OTP.</p><button type="button" className="secondary" onClick={() => setSampleSelected(true)}>Use sample registered customer</button>{sampleSelected && <><p>Demo customer · age 30 · 0770000000 · Prefer not to say</p><button type="button" className="primary" onClick={verifySample}>Simulate verification</button></>}</div> :
          <form ref={formRef} onSubmit={identify} noValidate autoComplete="off">
            <div className="form-grid">
              {field('name', 'Fictional name (required)', <input {...accessibility('name')} value={profile.name} onChange={event => updateProfile('name', event.target.value)} required />)}
              {field('age', 'Age (required)', <input {...accessibility('age')} type="text" inputMode="numeric" value={profile.age} onChange={event => updateProfile('age', event.target.value)} required />)}
              {field('gender', 'Gender (optional)', <select {...accessibility('gender')} value={profile.gender} onChange={event => updateProfile('gender', event.target.value)}><option value="">Choose or leave blank</option>{['Male', 'Female', 'Other', 'Prefer not to say'].map(value => <option key={value}>{value}</option>)}</select>)}
              {field('phone', 'Fictional mobile number (required)', <input {...accessibility('phone', true)} type="tel" value={profile.phone} onChange={event => updateProfile('phone', event.target.value)} required />, 'Sri Lankan mobile format: 0771234567 or +94771234567. Spaces and hyphens are accepted.')}
            </div><div className="button-row"><button type="submit" className="primary">Continue with demo profile</button><Link to="/" className="secondary">Back to browsing</Link></div>
          </form>}
      </>}
      {step === 'appointment' && <form ref={formRef} onSubmit={review} noValidate autoComplete="off">
        <p>Welcome, {profile.name || 'Demo customer'}. Choose preferences for a demonstration. Available appointment slots and staff schedules are not connected.</p>
        <div className="form-grid">
          {field('area', 'Area', <select id="area" name="area" value={area} onChange={event => { setArea(event.target.value); setKind(''); updateDraft('offeringId', ''); setUnknownSelection(false); }}><option value="">All areas</option><option value="wellness">Wellness</option><option value="salon">Salon</option><option value="cosmetic">Cosmetic</option></select>)}
          {field('kind', 'Offering type', <select id="kind" name="kind" value={kind} onChange={event => { setKind(event.target.value); updateDraft('offeringId', ''); setUnknownSelection(false); }}><option value="">All types</option>{kinds.filter(value => allOfferings.some(item => (!area || item.area === area) && item.kind === value)).map(value => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}</select>)}
          {field('offeringId', 'Offering (required)', <select {...accessibility('offeringId')} value={draft.offeringId} onChange={event => { updateDraft('offeringId', event.target.value); setUnknownSelection(false); }} required><option value="">Choose an offering</option>{options.map(item => <option key={item.id} value={item.id}>{item.name} · {item.area} · {offeringPrice(item)}</option>)}</select>)}
          {field('date', 'Preferred date (required)', <input {...accessibility('date', true)} type="date" min={colomboToday()} value={draft.date} onChange={event => updateDraft('date', event.target.value)} required />, 'Today or later in Asia/Colombo. This is a preference, not an available slot.')}
          {field('time', 'Preferred time (required)', <select {...accessibility('time')} value={draft.time} onChange={event => updateDraft('time', event.target.value)} required><option value="">Choose a time period</option>{preferredTimes.map(value => <option key={value}>{value}</option>)}</select>)}
          {field('notes', 'Fictional notes (optional)', <textarea {...accessibility('notes', true)} value={draft.notes} onChange={event => updateDraft('notes', event.target.value)} rows={3} />, 'Do not enter real medical or sensitive information in this demonstration.')}
        </div>
        {offering && <p className="booking-selection"><strong>{offering.name}</strong> · {offering.area} · {offeringPrice(offering)}{offering.providerLabel && ` · ${offering.providerLabel}`}</p>}
        {offering?.kind === 'membership' && <p className="booking-notice">Membership selections are enquiries only. This demo does not activate a membership or take payment. Policies remain pending approval.</p>}
        <div className="button-row"><button type="submit" className="primary">Review demo request</button><button type="button" className="secondary" onClick={() => { setIdentityMode('new'); go('identify'); }}>Edit demo details</button></div>
      </form>}
      {step === 'review' && <form ref={formRef} onSubmit={confirm} noValidate>
        <dl className="booking-summary"><div><dt>Fictional customer</dt><dd>{profile.name} · age {profile.age}{profile.gender ? ` · ${profile.gender}` : ''}</dd></div><div><dt>Fictional phone</dt><dd>{profile.phone}</dd></div></dl>
        {appointmentSummary()}
        <p>This is a local demonstration of a request. Preferences need clinic confirmation in a future live service.{offering?.kind === 'membership' ? ' This membership enquiry does not activate membership or take payment.' : ''}</p>
        <div className="field booking-ack"><label htmlFor="acknowledged"><input {...accessibility('acknowledged')} type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} /> I understand this is a demo, have used fictional details, and acknowledge the sample privacy notice: details stay in React memory until refresh and nothing is sent.</label>{errors.acknowledged && <p className="error" role="alert" id="acknowledged-error">{errors.acknowledged}</p>}</div>
        <div className="button-row"><button type="submit" className="primary">Create demo request preview</button><button type="button" className="secondary" onClick={() => go('appointment')}>Edit appointment</button><button type="button" className="secondary" onClick={() => { setIdentityMode('new'); go('identify'); }}>Edit demo details</button></div>
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
