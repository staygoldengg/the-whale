import { AiToolForm } from '@/components/AiToolForm';
export default function Page(){return <AiToolForm tool="team-email" fields={[
{name:'audience',label:'Audience',placeholder:'All staff, Pre-K team, admin team'},
{name:'purpose',label:'Purpose',placeholder:'Theme week prep, schedule reminder, staff meeting'},
{name:'keyPoints',label:'Key points',type:'textarea',placeholder:'Bring completed activity sheets, check supply bins, arrive 10 minutes early'},
{name:'tone',label:'Tone',type:'select',options:['Professional','Warm','Direct','Encouraging','Brief']}
]} />}
