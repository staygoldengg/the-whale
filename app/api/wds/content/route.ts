import { NextRequest, NextResponse } from 'next/server';

interface WDSContent {
  id: string;
  title: string;
  emoji: string;
  url: string;
  description: string;
  type: 'program' | 'resource' | 'curriculum';
  ageGroup?: string;
}

// WDS content that's fetched from their website
const wdsContentLibrary: WDSContent[] = [
  {
    id: 'prog-2yo',
    title: 'Two-Year-Old Program',
    emoji: '👶',
    url: 'https://westhamptondayschool.org/curriculum/two-year-old-program/',
    description: 'Nurturing development through exploration and play. Focuses on language development, sensory exploration, and building security.',
    type: 'program',
    ageGroup: '2'
  },
  {
    id: 'prog-3yo',
    title: 'Three-Year-Old Program',
    emoji: '🧒',
    url: 'https://westhamptondayschool.org/curriculum/three-year-old-program/',
    description: 'Building independence and social skills. Emphasizes self-care, peer interaction, and emerging academic readiness.',
    type: 'program',
    ageGroup: '3'
  },
  {
    id: 'prog-pre-k',
    title: 'Pre-Kindergarten Program',
    emoji: '👧',
    url: 'https://westhamptondayschool.org/curriculum/pre-kindergarten-program/',
    description: 'Preparing for school success. Develops literacy, numeracy, and school readiness skills.',
    type: 'program',
    ageGroup: '4'
  },
  {
    id: 'prog-kinder',
    title: 'Kindergarten Program',
    emoji: '🎓',
    url: 'https://westhamptondayschool.org/curriculum/kindergarten-program/',
    description: 'Foundational academic skills and confidence. Builds strong literacy and math foundations.',
    type: 'program',
    ageGroup: '5'
  },
  {
    id: 'prog-after-school',
    title: 'After School Program',
    emoji: '⚽',
    url: 'https://westhamptondayschool.org/curriculum/after-school-program/',
    description: 'Enrichment and extended care. Offers enrichment activities and extended hours care.',
    type: 'program',
    ageGroup: 'all'
  },
  {
    id: 'resource-enrichment',
    title: 'Resource & Enrichment',
    emoji: '🎨',
    url: 'https://westhamptondayschool.org/resource-and-enrichment/',
    description: 'Specialized support and learning. Provides resource support and enrichment opportunities.',
    type: 'resource',
    ageGroup: 'all'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const ageGroup = searchParams.get('ageGroup');
  const q = searchParams.get('q');

  let results = wdsContentLibrary;

  // Filter by type
  if (type) {
    results = results.filter(item => item.type === type);
  }

  // Filter by age group
  if (ageGroup) {
    results = results.filter(
      item => item.ageGroup === 'all' || item.ageGroup === ageGroup
    );
  }

  // Search by title or description
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Store user interaction for AI learning
    const { interaction_type, query, response, staff_id } = body;

    // This would normally save to the database
    // For now, we're returning a mock learning record
    const learningRecord = {
      id: Math.random().toString(36).substr(2, 9),
      staff_id,
      interaction_type,
      query,
      response,
      created_at: new Date(),
      learning_extracted: `Learned: ${query.substring(0, 50)}...`
    };

    return NextResponse.json({
      success: true,
      message: 'AI learning recorded',
      record: learningRecord
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to record learning' },
      { status: 400 }
    );
  }
}
