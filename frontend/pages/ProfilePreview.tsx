import {DemoSession} from '../session';
import {Link} from '../ui';
import Profile from './Profile';
import {ageFromDateOfBirth} from '../lib/booking';
const example={name:'Example visitor',username:'example.visitor',email:'visitor@example.com',phone:'+94770000000',dateOfBirth:'1996-01-01',age:String(ageFromDateOfBirth('1996-01-01')),gender:'Prefer not to say'};
export default function ProfilePreview(){return <><aside className="container" style={{paddingTop:32}}><div className="booking-notice"><strong>Completed profile · read-only example</strong><p>This fictional profile shows what members see after registration. It does not create an account or sign you in.</p><Link to="/profile/" className="secondary">Create your own demo profile →</Link></div></aside><DemoSession previewCustomer={example}><fieldset disabled aria-label="Read-only completed profile" style={{border:0,padding:0,margin:0,minWidth:0}}><Profile/></fieldset></DemoSession></>;}
