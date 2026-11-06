import {createContext,useContext,useRef,useState,type ReactNode} from 'react';
import type {DemoCustomer} from './lib/types';
import {DemoAccounts,type Profile} from './lib/accounts';
type Session={customer:DemoCustomer|null;setCustomer:(customer:DemoCustomer|null)=>void;register:(profile:Profile,password:string)=>Promise<void>;login:(identifier:string,password:string)=>Promise<void>;updateProfile:(profile:Profile,currentPassword:string,newPassword:string)=>Promise<void>};
const Context=createContext<Session>(null!);
export function DemoSession({children,previewCustomer=null}:{children:ReactNode;previewCustomer?:DemoCustomer|null}){
 const [customer,setCustomer]=useState<DemoCustomer|null>(previewCustomer);const accounts=useRef(new DemoAccounts());
 const register=async(profile:Profile,password:string)=>{setCustomer(await accounts.current.register(profile,password));};
 const login=async(identifier:string,password:string)=>{setCustomer(await accounts.current.login(identifier,password));};
 const updateProfile=async(profile:Profile,currentPassword:string,newPassword:string)=>{setCustomer(await accounts.current.update(customer as Profile,profile,currentPassword,newPassword));};
 return <Context.Provider value={{customer,setCustomer,register,login,updateProfile}}>{children}</Context.Provider>;
}
export const useDemoSession=()=>useContext(Context);
