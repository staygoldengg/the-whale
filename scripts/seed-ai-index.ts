import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Missing Supabase env vars.');
const supabase = createClient(url, key);

const categories = [
  'Theme Weeks','Parent Messages','Staff Emails','Classroom Activities','Slogans',
  'Coloring Page Prompts','SEL Activities','Safety Updates','Schedule Notes','School Culture'
];

const base: Record<string, string[]> = {
  'Theme Weeks': ['Whalecome Back Week','Ocean Helpers','Kindness Crew','Community Helpers','Colors Around Us','Friendship Garden','Weather Watchers','Healthy Habits','Tiny Scientists','Family Traditions'],
  'Parent Messages': ['Daily Recap','Supply Reminder','Event Reminder','Positive Classroom Moment','Gentle Schedule Note','Outdoor Play Reminder','Picture Day Notice','Rest Time Reminder','Snack Note','Weekly Preview'],
  'Staff Emails': ['Theme Prep Email','Coverage Reminder','Meeting Follow-up','Supply Bin Check','Classroom Reset','Friday Wrap-up','Morning Huddle','Event Prep','Training Reminder','Thank You Note'],
  'Classroom Activities': ['Circle Time Song','Fine Motor Tray','Sensory Bin','Story Extension','Movement Game','Partner Share','Counting Walk','Shape Hunt','Art Center','Calm Corner Practice'],
  'Slogans': ['Small Fins Big Feelings','Whalecome To Learning','Dive Into Kindness','Make Waves Together','Little Learners Big Hearts','Splash Into Reading','Our Pod Helps','Kindness Makes Waves','Ready Set Grow','Every Child Shines'],
  'Coloring Page Prompts': ['Whale With Backpack','Whale Reading A Book','Friendly Ocean Classroom','Crayon Whale','Whale And Friends','Whale At Circle Time','Whale On Playground','Whale Holding Heart','Whale With Shapes','Whale School Bus'],
  'SEL Activities': ['Name Your Feeling','Kind Hands Practice','Breathing Like Waves','Friendship Turn Taking','Calm Body Check','Helper Of The Day','Thank You Circle','Problem Solving Puppets','Feelings Color Match','Classroom Compliment'],
  'Safety Updates': ['Weather Delay Language','Drill Notice','Pickup Reminder','Handwashing Reminder','Allergy-Aware Snack Note','Outdoor Heat Reminder','Rainy Day Notice','Door Safety Reminder','Label Belongings','Calm Emergency Tone'],
  'Schedule Notes': ['Early Closure','Staff Coverage','Special Visitor','Classroom Rotation','Outdoor Time Change','Lunch Timing','Nap Room Coverage','Planning Time','Field Activity','Photo Day Flow'],
  'School Culture': ['Warm Professional Voice','Brightwheel-ready Format','Family Partnership','Preschool-safe Language','Privacy First','Staff Appreciation','Play-Based Learning','Routine And Predictability','Inclusive Language','Mascot Voice']
};

const items = categories.flatMap((category) => base[category].map((title, i) => ({
  title,
  category,
  age_group: i % 3 === 0 ? 'Pre-K' : i % 3 === 1 ? 'Age 3' : 'Mixed preschool',
  approved: true,
  tags: [category.toLowerCase().replaceAll(' ','-'), 'westhampton', 'preschool', 'the-whale'],
  content: `${title}: Use a warm, clear, preschool-safe approach. Keep directions simple, family communication respectful, and activities developmentally appropriate. Format outputs so staff can copy them into Brightwheel or email without extra cleanup. Include materials, timing, and a calm professional tone when relevant.`
})));

async function main() {
  const { error } = await supabase.from('ai_index_items').upsert(items, { onConflict: 'title,category', ignoreDuplicates: false });
  if (error) throw error;
  console.log(`Seeded ${items.length} AI index items.`);
}

main();
