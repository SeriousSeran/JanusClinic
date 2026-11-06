import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DemoCustomer } from './lib/types';
const Context = createContext<{customer: DemoCustomer | null;setCustomer:(customer:DemoCustomer|null)=>void}>({customer:null,setCustomer:()=>{}});
export function DemoSession({children}:{children:ReactNode}) {
  const [customer,setCustomer]=useState<DemoCustomer|null>(null);
  return <Context.Provider value={{customer,setCustomer}}>{children}</Context.Provider>;
}
export const useDemoSession=()=>useContext(Context);
