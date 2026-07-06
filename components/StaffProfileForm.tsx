'use client';
import { useState } from 'react';

const fields = [
  ['full_name','Full legal/display name','input'], ['preferred_name','Preferred name','input'], ['email','Email','input'],
  ['role_title','Role title','input'], ['classroom','Classroom','input'], ['pronouns','Pronouns','input'],
  ['gender_reference','Gender/reference rule','input'], ['career_goal','Career goal','input'], ['tone_preference','Tone preference','input'],
  ['strengths','Strengths, comma separated','textarea'], ['growth_areas','Growth areas, comma separated','textarea'],
  ['certifications','Certifications/training, comma separated','textarea'], ['do_not_say','Do-not-say notes, comma separated','textarea'], ['notes','Admin notes','textarea']
] as const;

export function StaffProfileForm(){
  const [values,setValues]=useState<Record<string,string>>({});
  const [message,setMessage]=useState('');
  const [loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setMessage('');
    const res = await fetch('/api/staff-profiles',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
    const data = await res.json(); setLoading(false);
    if(!res.ok) return setMessage(data.error ?? 'Save failed');
    setMessage(`Saved ${data.full_name}. Refresh to see the profile card.`); setValues({});
  }
  return <form onSubmit={submit} className="whale-panel space-y-4 p-6"><div><p className="text-sm font-bold uppercase tracking-wide text-whale-700">Admin Form</p><h2 className="mt-1 text-2xl font-black">Add Staff Source-of-Truth Profile</h2></div>{fields.map(([name,label,type])=><label key={name} className="block space-y-2"><span className="whale-label">{label}</span>{type==='textarea'?<textarea className="whale-input min-h-20" value={values[name]??''} onChange={(e)=>setValues(v=>({...v,[name]:e.target.value}))}/>:<input className="whale-input" value={values[name]??''} onChange={(e)=>setValues(v=>({...v,[name]:e.target.value}))}/>}</label>)}<button className="whale-button w-full" disabled={loading}>{loading?'Saving...':'Save staff profile'}</button>{message&&<p className="rounded-2xl bg-whale-50 p-4 text-sm font-semibold text-whale-900">{message}</p>}</form>
}
