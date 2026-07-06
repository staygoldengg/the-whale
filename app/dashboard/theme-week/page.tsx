import { AiToolForm } from '@/components/AiToolForm';
export default function Page(){return <AiToolForm tool="theme-week" fields={[
{name:'theme',label:'Theme name',placeholder:'Ocean helpers, kindness week, community jobs'},
{name:'ageGroup',label:'Age group',type:'select',options:['Toddlers','Age 2','Age 3','Pre-K','Mixed preschool']},
{name:'dates',label:'Week dates',placeholder:'August 17-21'},
{name:'learningGoals',label:'Learning goals',type:'textarea',placeholder:'SEL, fine motor, colors, letters, classroom community'},
{name:'materials',label:'Available materials',type:'textarea',placeholder:'Crayons, paper plates, glue sticks, whale mascot, outdoor toys'},
{name:'tone',label:'Tone',type:'select',options:['Warm and playful','Professional','Seasonal','Faith-neutral','High energy']}
]} />}
