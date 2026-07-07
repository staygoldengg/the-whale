import type { AiIndexItem } from './types';

export type DevelopmentDomain =
  | 'Literacy'
  | 'Math'
  | 'Science'
  | 'Social-Emotional'
  | 'Physical Development'
  | 'Creative Arts'
  | 'Community/Cultural Awareness'
  | 'Daily Literature'
  | 'Field Trip'
  | 'Safety';

export type LessonPlanKnowledgeRecord = {
  id: string;
  teacher: string;
  ageGroup: string;
  theme: string;
  weekOf: string;
  fieldTrip?: string;
  domains: Partial<Record<DevelopmentDomain, string[]>>;
  books: string[];
  materials: string[];
  notes?: string;
  source: string;
};

const createdAt = '2026-07-06T00:00:00.000Z';

// Example curriculum knowledge base - schools can add their own
export const lessonPlanRecords: LessonPlanKnowledgeRecord[] = [
  {
    id: 'example-prek-storytelling-week',
    teacher: 'Example',
    ageGroup: 'Pre-K',
    theme: 'Storytelling & Characters',
    weekOf: 'Any week',
    fieldTrip: 'Optional: Local library visit or guest reader',
    domains: {
      Literacy: [
        'Listen to rhymes and riddles and identify rhyming words.',
        'Answer open-ended questions during book readings.',
        'Participate in storytelling segment.'
      ],
      Math: ['Count characters in a book.', 'Count and sort objects by size.'],
      'Social-Emotional': ['Create puppet shows.', 'Use dramatic play with character props.', 'Use imagination.'],
      'Creative Arts': ['Role play scenes from stories.', 'Create illustrations.', 'Paint scenes.'],
      'Daily Literature': ['The Very Hungry Caterpillar', 'Where the Wild Things Are', 'Corduroy']
    },
    books: ['The Very Hungry Caterpillar', 'Where the Wild Things Are', 'Corduroy', 'The Lion and the Mouse'],
    materials: ['puppets', 'paint', 'construction paper', 'markers', 'story props'],
    notes: 'Strong integration of literature across all domains.',
    source: 'The Whale Lesson Planning Knowledge Base'
  },
  {
    id: 'example-elementary-science-week',
    teacher: 'Example',
    ageGroup: 'Grades K-2',
    theme: 'Living Things & Habitats',
    weekOf: 'Any week',
    fieldTrip: 'Nature walk or nature center visit',
    domains: {
      Science: ['Observe insects and plants', 'Learn about habitats', 'Classify living things'],
      Literacy: ['Read books about animals', 'Write observations', 'Create habitat posters'],
      Math: ['Count legs on insects', 'Measure plant growth', 'Sort by habitat'],
      'Social-Emotional': ['Care for classroom plants/insects', 'Discuss environmental stewardship'],
      'Creative Arts': ['Draw animals in habitats', 'Create nature collages']
    },
    books: ['The Very Busy Spider', 'From Caterpillar to Butterfly', 'Habitats', 'A House for Hermit Crab'],
    materials: ['magnifying glasses', 'observation journals', 'paints', 'collage materials', 'potting soil', 'seeds'],
    notes: 'Hands-on science observation combined with literacy and math.',
    source: 'The Whale Lesson Planning Knowledge Base'
  }
];

export function campLessonRecordsToIndexItems(records: LessonPlanKnowledgeRecord[]): AiIndexItem[] {
  return records.map((record) => ({
    id: `lesson-${record.id}`,
    title: `Lesson Plan: ${record.theme} (${record.ageGroup})`,
    category: 'Classroom Activities',
    content: `Theme: ${record.theme}. Week: ${record.weekOf}. Domains covered: ${Object.keys(record.domains).join(', ')}. Books: ${record.books.join(', ')}. Materials: ${record.materials.join(', ')}. ${record.notes || ''}`,
    tags: ['lesson-plan', record.ageGroup.toLowerCase(), record.theme.toLowerCase().replace(/\s+/g, '-')],
    age_group: record.ageGroup,
    approved: true,
    created_by: record.teacher,
    created_at: createdAt
  }));
}

export function getMostRelevantLessonPlan(
  records: LessonPlanKnowledgeRecord[],
  ageGroup: string,
  theme?: string
): LessonPlanKnowledgeRecord | null {
  const filtered = records.filter((r) => r.ageGroup.toLowerCase().includes(ageGroup.toLowerCase()));

  if (theme) {
    const themeMatch = filtered.find((r) => r.theme.toLowerCase().includes(theme.toLowerCase()));
    if (themeMatch) return themeMatch;
  }

  return filtered.length > 0 ? filtered[0] : null;
}
