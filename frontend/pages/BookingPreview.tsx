import {DemoSession} from '../session';
import {Link} from '../ui';
import Booking from './Booking';
import {ageFromDateOfBirth} from '../lib/booking';
const example={name:'Example visitor',username:'example.visitor',email:'visitor@example.com',phone:'+94770000000',dateOfBirth:'1996-01-01',age:String(ageFromDateOfBirth('1996-01-01')),gender:'Prefer not to say'};
export default function BookingPreview(){return <><aside className="container" style={{paddingTop:32}}><div className="booking-notice"><strong>Booking design preview · read only</strong><p>This shows the current booking page with a fictional profile and selected consultation. It does not register or sign you in. The booking controls below are disabled for this visual review.</p><Link to="/profile/" className="secondary">Create a profile / Sign in to try booking →</Link></div></aside><DemoSession previewCustomer={example}><fieldset disabled aria-label="Read-only booking design" style={{border:0,padding:0,margin:0,minWidth:0}}><Booking initialOfferingId="initial-consultation"/></fieldset></DemoSession></>;}
