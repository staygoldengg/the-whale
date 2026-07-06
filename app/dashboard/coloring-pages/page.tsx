import { AiToolForm } from '@/components/AiToolForm';
export default function Page(){return <AiToolForm tool="coloring-page" fields={[
{name:'theme',label:'Coloring page theme',placeholder:'The Whale welcomes friends to school'},
{name:'ageGroup',label:'Age group',type:'select',options:['Toddlers','Age 2','Age 3','Pre-K','Mixed preschool']},
{name:'skillFocus',label:'Skill focus',type:'select',options:['Fine motor','Color recognition','Shapes','Letters','SEL','Following directions']},
{name:'mustInclude',label:'Must include',type:'textarea',placeholder:'Whale mascot, backpack, crayons, classroom rug'},
{name:'avoid',label:'Avoid',placeholder:'Small details, text, shading, scary faces'}
]} />}
