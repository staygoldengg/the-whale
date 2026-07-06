import { AiToolForm } from '@/components/AiToolForm';
export default function Page(){return <AiToolForm tool="theme-analysis" fields={[
{name:'theme',label:'School theme',placeholder:'Whalecome Back Week'},
{name:'approach',label:'Current approach',type:'textarea',placeholder:'Describe planned activities, communications, family engagement, decorations'},
{name:'goals',label:'What you want to improve',type:'textarea',placeholder:'More family engagement, stronger slogans, clearer staff prep'},
{name:'comparison',label:'Comparison target',placeholder:'Other preschool theme weeks, general best practices, past WDS examples'}
]} />}
