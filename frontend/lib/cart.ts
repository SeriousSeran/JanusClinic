import products from '../data/products.json' with {type:'json'};
export { products };
export type Cart = Record<string, number>;
export function normalizeCart(value:unknown):Cart {
 const result:Cart={};
 if(!value||typeof value!=='object'||Array.isArray(value))return result;
 for(const p of products){const n=(value as Cart)[p.id];if(Number.isInteger(n)&&n>0)result[p.id]=Math.min(n,20);}
 return result;
}
export function cartLines(cart:Cart){const safe=normalizeCart(cart);return products.filter(p=>safe[p.id]).map(p=>({...p,quantity:safe[p.id],total:p.price*safe[p.id]}));}
export const cartTotal=(cart:Cart)=>cartLines(cart).reduce((sum,p)=>sum+p.total,0);
export const lkr=(amount:number)=>'LKR '+amount.toLocaleString('en-LK');
export interface OrderContact{name:string;phone:string;fulfilment:'pickup'|'delivery';address:string;notes:string;}
export function orderMessage(cart:Cart,contact:OrderContact){
 const lines=cartLines(cart);if(!lines.length)throw new Error('Your bag is empty.');
 const phoneDigits=contact.phone.replace(/\D/g,'');
 if(phoneDigits.length<7||phoneDigits.length>15)throw new Error('Please enter a valid contact number.');
 if(!contact.name.trim()||!contact.phone.trim()||(contact.fulfilment==='delivery'&&!contact.address.trim()))throw new Error('Please complete your contact and delivery details.');
 return ['Hello Janus, I would like to request this product order:','',...lines.map(p=>`${p.name} | ${p.quantity} × ${lkr(p.price)} = ${lkr(p.total)}`),'',`Product subtotal: ${lkr(cartTotal(cart))}`,`Name: ${contact.name.trim()}`,`Contact number: ${contact.phone.trim()}`,`Preferred fulfilment: ${contact.fulfilment==='pickup'?'Clinic pickup':'Delivery'}`,contact.fulfilment==='delivery'?`Delivery address: ${contact.address.trim()}`:'',contact.notes.trim()?`Notes: ${contact.notes.trim()}`:'','Please confirm availability, current prices, any delivery fee, final total and payment arrangements.'].filter((s,i,a)=>s!==''||a[i-1]!=='').join('\n');
}
