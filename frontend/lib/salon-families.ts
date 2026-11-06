interface Service {id:string;name:string;category:string}
export interface SalonFamily<T extends Service> {key:string;name:string;variants:T[]}
export function groupSalonOfferings<T extends Service>(offerings:T[]):SalonFamily<T>[] {
 const families=new Map<string,SalonFamily<T>>();
 for(const offering of offerings){
  const name=offering.name.replace(/\s+[–-]\s+(Short|Medium|Long)\s+crown area$/i,' – Crown area').replace(/\s+[–-]\s+(Short|Medium|Long)(?:\s+hair)?$/i,'');
  const key=offering.category+':'+name;
  const family=families.get(key);
  if(family)family.variants.push(offering);else families.set(key,{key,name,variants:[offering]});
 }
 return [...families.values()];
}
