import { AiToolForm } from '@/components/AiToolForm';
export default function Page(){return <AiToolForm tool="weekly-plan" fields={[
{name:'theme',label:'Weekly theme',placeholder:'All About Me, Ocean Week, Community Helpers'},
{name:'ageGroup',label:'Age group',type:'select',options:['Toddlers','Age 2','Age 3','Pre-K','Mixed preschool']},
{name:'goals',label:'Learning goals',type:'textarea',placeholder:'Letter W, friendship, sorting colors, fine motor practice'},
{name:'constraints',label:'Constraints or notes',type:'textarea',placeholder:'No messy paint Tuesday. Outdoor time after snack.'},
{name:'parentNote',label:'Parent note focus',placeholder:'What families should know this week'}
]} />}
