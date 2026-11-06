# Doctor card and contact bubble · private preview

The homepage has a fourth destination: Dr. Jayaruwan Bandara, with the supplied portrait, factual introductory copy, a Meet your Doctor link and a Contact your Doctor control. The doctor page also offers this control.

The existing memory-only demo session gates the composer. Unidentified visitors enter `/book/?intent=contact-doctor`; after demo registration or selecting the sample registered profile, the app returns to the homepage and opens the composer. This does not implement production authentication.

The native dialog supplies modal focus handling, Escape dismissal, explicit close and return focus. It includes message text, a profile-details disclosure and up to five image attachments of 10 MB each. Object URLs are revoked on replacement/unmount. Files are not uploaded or stored; profile fields remain fictional and in memory. The outgoing text starts with name, phone, email and age. Date of birth is not included.

The recipient is configured in `frontend/data/clinic.json` as `doctorWhatsApp`, set to +94772122222 as explicitly supplied by the owner. Do not substitute a clinic number as a doctor's direct contact without confirmation. Buttons remain disabled until a message and consent are supplied.

WhatsApp URL drafts support text only. On supported devices, Web Share can pass files and text to a user-chosen app/recipient; it cannot force WhatsApp or guarantee delivery. The interface explains choosing WhatsApp and the confirmed doctor contact. A text-draft link supplies the configured number and message; desktop/unsupported browsers must attach photos in WhatsApp itself. This website does not send messages automatically or claim delivery.

Type checking, export auditing, capture integrity and existing unit checks pass. Browser/WhatsApp end-to-end checks remain pending in this environment. No real message or photo was sent during implementation. GitHub is unchanged.
