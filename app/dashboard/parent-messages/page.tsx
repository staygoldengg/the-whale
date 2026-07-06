import { AiToolForm } from '@/components/AiToolForm';
export default function Page(){return <AiToolForm tool="parent-message" fields={[
{name:'messageType',label:'Message type',type:'select',options:['Daily recap','Reminder','Event announcement','Supply request','Schedule note','Positive classroom update']},
{name:'className',label:'Class or group',placeholder:'Pre-K, Blue Room, all families'},
{name:'details',label:'Important details',type:'textarea',placeholder:'Picture day is Friday. Please bring a labeled water bottle.'},
{name:'tone',label:'Tone',type:'select',options:['Warm','Professional','Short','Extra friendly','Urgent but calm']}
]} />}
