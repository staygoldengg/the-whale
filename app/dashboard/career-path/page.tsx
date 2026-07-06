import { AiToolForm } from '@/components/AiToolForm';
export default function Page(){return <AiToolForm tool="career-path" fields={[
{name:'employeeName',label:'Employee name',placeholder:'Staff member name'},
{name:'currentRole',label:'Current role',placeholder:'Assistant teacher, floater, lead teacher'},
{name:'desiredRole',label:'Career goal',placeholder:'Lead teacher, admin assistant, program coordinator'},
{name:'strengths',label:'Strengths',type:'textarea',placeholder:'Great with transitions, strong parent communication, creative lesson ideas'},
{name:'growthAreas',label:'Growth areas',type:'textarea',placeholder:'Documentation, classroom routines, behavior redirection, certifications'},
{name:'certifications',label:'Current or needed certifications',type:'textarea',placeholder:'CPR, MAT, CDA, Brightwheel training, internal onboarding'},
{name:'tone',label:'Tone',type:'select',options:['Encouraging','Professional','Direct coaching','Gentle mentorship']}
]} />}
