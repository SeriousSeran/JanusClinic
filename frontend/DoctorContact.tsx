import {useEffect,useRef,useState} from 'react';
import {Link} from './ui';
import {useDemoSession} from './session';
import clinic from './data/clinic.json';
import './doctor-contact.css';
export default function DoctorContact(){
 const {customer}=useDemoSession();const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 const [message,setMessage]=useState('');const [photos,setPhotos]=useState<File[]>([]);const [status,setStatus]=useState('');const [consent,setConsent]=useState(false);
 const [previews,setPreviews]=useState<string[]>([]);
 const recipient=clinic.doctorWhatsApp.replace(/\D/g,'');
 useEffect(()=>{const urls=photos.map(file=>URL.createObjectURL(file));setPreviews(urls);return()=>urls.forEach(URL.revokeObjectURL);},[photos]);
 useEffect(()=>{if(customer&&new URLSearchParams(location.search).get('contact-doctor')==='1'){dialog.current?.showModal();history.replaceState({},'',location.pathname);}},[customer]);
 const text=customer?`JANUS DESIGN PREVIEW — fictional profile\nName: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${customer.email}\nAge: ${customer.age}\n\nMessage to Dr. Jayaruwan Bandara:\n${message.trim()}`:'';
 const ready=Boolean(recipient&&message.trim()&&consent);
 async function sharePhotos(){
  if(!ready||!photos.length)return;
  if(!navigator.canShare?.({files:photos,text})||!navigator.share){setStatus('Photo sharing is unavailable in this browser. Open the WhatsApp text draft and add your photos inside WhatsApp.');return;}
  try{await navigator.share({title:'Message to Dr. Jayaruwan Bandara',text,files:photos});setStatus('Share sheet closed. Delivery is handled by the app you choose; this website cannot confirm it.');}catch(error){if((error as DOMException).name!=='AbortError')setStatus('Sharing could not open. Use the WhatsApp text draft and attach photos there.');}
 }
 if(!customer)return <Link to="/profile/?next=%2F%3Fcontact-doctor%3D1" className="secondary">Contact your Doctor ↗</Link>;
 return <><button ref={trigger} type="button" className="secondary" onClick={()=>dialog.current?.showModal()}>Contact your Doctor ↗</button><dialog ref={dialog} className="doctor-contact-bubble" aria-labelledby="doctor-message-title" onClose={()=>trigger.current?.focus()} onClick={event=>{if(event.target===dialog.current)dialog.current.close();}}>
 <div className="doctor-bubble-heading"><div><p className="eyebrow">A conversation with your doctor</p><h2 id="doctor-message-title">How can we help?</h2></div><button type="button" className="secondary" aria-label="Close doctor message" onClick={()=>dialog.current?.close()}>×</button></div>
 <p className="small">Demo profile · use fictional details and sample photos only. Nothing is uploaded to Janus. WhatsApp or your sharing app opens only when you choose.</p>
 <details><summary>Your details at the start of the message</summary><dl><dt>Name</dt><dd>{customer.name}</dd><dt>Phone</dt><dd>{customer.phone}</dd><dt>Email</dt><dd>{customer.email}</dd><dt>Age</dt><dd>{customer.age}</dd></dl></details>
 <label htmlFor="doctor-message">Your message</label><textarea id="doctor-message" rows={4} maxLength={2000} value={message} onChange={event=>setMessage(event.target.value)} placeholder="Tell the doctor what you would like to discuss…"/>
 <label htmlFor="doctor-photos">Photos (optional · up to 5, 10 MB each)</label><input id="doctor-photos" type="file" accept="image/*" multiple onChange={event=>{const files=Array.from(event.target.files??[]);if(files.length>5||files.some(file=>!file.type.startsWith('image/')||file.size>10*1024*1024)){setStatus('Choose up to five image files, each no larger than 10 MB.');event.target.value='';return;}setPhotos(files);setStatus('');}}/>
 <div className="doctor-photo-previews">{photos.map((photo,index)=><figure key={`${photo.name}-${index}`}><img src={previews[index]} alt={`Selected photo ${index+1}`} /><figcaption>{photo.name}</figcaption><button type="button" aria-label={`Remove photo ${index+1}`} onClick={()=>setPhotos(files=>files.filter((_,i)=>i!==index))}>Remove</button></figure>)}</div>
 <p className="small">WhatsApp text links cannot attach photos. On supported devices, “Share photos &amp; message” opens your share sheet: choose WhatsApp, then the doctor’s confirmed contact. Otherwise attach the photos inside WhatsApp after opening the text draft.</p>
 <label className="doctor-consent"><input type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)}/>I agree to share these profile details, message and any selected photos with my chosen recipient.</label>
 {recipient&&<p className="small">Doctor’s WhatsApp: {clinic.doctorWhatsApp}</p>}{!recipient&&<p role="status" className="doctor-recipient-pending">Message preview is ready. Sending will be available once the doctor’s WhatsApp number is confirmed.</p>}
 <div className="button-row">{ready?<a className="primary" href={`https://wa.me/${recipient}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">Open WhatsApp text draft ↗</a>:<button className="primary" disabled>Open WhatsApp text draft ↗</button>}<button type="button" className="secondary" disabled={!ready||!photos.length} onClick={sharePhotos}>Share photos &amp; message</button></div><p className="small" role="status">{status}</p>
 </dialog></>;
}
