import { NextRequest, NextResponse } from 'next/server';

interface CareerPath {
  id: string;
  title: string;
  icon: string;
  description: string;
  current_skills: string[];
  target_skills: string[];
  milestones: string[];
  timeline_months: number;
  video_resources: string[];
  ai_guidance: string;
}

const careerPaths: CareerPath[] = [
  {
    id: 'lead-teacher',
    title: 'Lead Teacher',
    icon: '👨‍🏫',
    description: 'Take on classroom leadership, mentoring, and curriculum development responsibilities.',
    current_skills: ['Classroom management', 'Lesson planning', 'Student engagement'],
    target_skills: ['Leadership', 'Mentoring', 'Curriculum design', 'Professional development'],
    milestones: [
      '2+ years classroom experience',
      'Bachelor\'s degree in Early Childhood Education',
      'Leadership certification program',
      'Mentor 1-2 junior teachers',
      'Lead curriculum initiative'
    ],
    timeline_months: 18,
    video_resources: [
      'https://youtube.com/playlist?list=PLJbL3nqQWaSwcTkH68zU4OYc5XcB_Kc0r',
      'https://youtube.com/playlist?list=PLn0lJLtsdotE6M_-zdKtxsYUPuI3qnqA-'
    ],
    ai_guidance: 'Focus on developing mentoring skills and understanding curriculum frameworks. Start leading small professional development sessions.'
  },
  {
    id: 'curriculum-specialist',
    title: 'Curriculum Specialist',
    icon: '📚',
    description: 'Develop school-wide curriculum, assess learning outcomes, and guide instructional practices.',
    current_skills: ['Curriculum knowledge', 'Assessment', 'Data analysis'],
    target_skills: ['Curriculum design', 'Program evaluation', 'Teacher coaching', 'Research synthesis'],
    milestones: [
      '3+ years teaching experience',
      'Master\'s degree in Education or Curriculum',
      'Advanced curriculum design certification',
      'Publish curriculum framework',
      'Lead assessment initiative'
    ],
    timeline_months: 24,
    video_resources: [
      'https://youtube.com/playlist?list=PLwlEmipfEbAKU3cleFpeGt_WNDube8iGk',
      'https://youtube.com/playlist?list=PLJbL3nqQWaSwcTkH68zU4OYc5XcB_Kc0r'
    ],
    ai_guidance: 'Deepen your understanding of developmental theory and evidence-based practices. Study curriculum models and assessment techniques.'
  },
  {
    id: 'school-admin',
    title: 'School Administrator',
    icon: '🏫',
    description: 'Lead school operations, staff development, strategic planning, and community engagement.',
    current_skills: ['School knowledge', 'Communication', 'Problem-solving'],
    target_skills: ['Strategic planning', 'Personnel management', 'Budget oversight', 'Community leadership'],
    milestones: [
      '5+ years teaching experience',
      'Master\'s degree in Education Administration',
      'Administrative credential',
      'Complete assistant principal role',
      'Lead major school initiative'
    ],
    timeline_months: 36,
    video_resources: [
      'https://youtube.com/playlist?list=PLn0lJLtsdotE6M_-zdKtxsYUPuI3qnqA-'
    ],
    ai_guidance: 'Study leadership theory, school law, and financial management. Build your understanding of early childhood education policy and advocacy.'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pathId = searchParams.get('id');
  const includeGuidance = searchParams.get('guidance') === 'true';

  if (pathId) {
    const path = careerPaths.find(p => p.id === pathId);
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Career path not found' },
        { status: 404 }
      );
    }
    
    if (!includeGuidance) {
      const { ai_guidance, ...pathWithoutGuidance } = path;
      return NextResponse.json({ success: true, data: pathWithoutGuidance });
    }

    return NextResponse.json({ success: true, data: path });
  }

  return NextResponse.json({
    success: true,
    count: careerPaths.length,
    data: careerPaths.map(({ ai_guidance, ...rest }) => rest)
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { staff_id, path_id, current_progress, feedback } = body;

    // Track career path progress (would be saved to database)
    const careerRecord = {
      id: Math.random().toString(36).substr(2, 9),
      staff_id,
      path_id,
      progress_percentage: current_progress || 0,
      last_updated: new Date(),
      feedback_recorded: !!feedback,
      ai_next_steps: generateNextSteps(path_id, current_progress)
    };

    return NextResponse.json({
      success: true,
      message: 'Career path progress recorded',
      record: careerRecord
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update career progress' },
      { status: 400 }
    );
  }
}

function generateNextSteps(pathId: string, progress: number): string[] {
  const steps: { [key: string]: string[] } = {
    'lead-teacher': [
      'Complete leadership training module',
      'Schedule 1:1 mentoring with current lead teacher',
      'Develop a classroom mentoring plan',
      'Attend professional development workshop',
      'Lead a team meeting on a teaching topic'
    ],
    'curriculum-specialist': [
      'Enroll in Master\'s program',
      'Join curriculum review committee',
      'Research evidence-based practices',
      'Design assessment framework',
      'Present findings to leadership'
    ],
    'school-admin': [
      'Shadow school administrator for a week',
      'Enroll in administrative credential program',
      'Lead school committee',
      'Develop strategic initiative',
      'Build community partnership'
    ]
  };

  const pathSteps = steps[pathId] || steps['lead-teacher'];
  const stepIndex = Math.min(Math.floor(progress / 20), pathSteps.length - 1);
  return pathSteps.slice(stepIndex, stepIndex + 3);
}
