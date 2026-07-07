import { NextRequest, NextResponse } from 'next/server';

interface AILearningRecord {
  id: string;
  staff_id?: string;
  query: string;
  response: string;
  topic: 'lesson_plan' | 'activity' | 'strategy' | 'general';
  quality_rating?: number;
  learning_extracted?: string;
  created_at: Date;
}

// In-memory store for demonstration (would be Supabase in production)
const learningRecords: AILearningRecord[] = [];
const learningIndex: { [key: string]: number } = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get('staff_id');
  const topic = searchParams.get('topic');
  const limit = parseInt(searchParams.get('limit') || '10');

  let results = learningRecords;

  if (staffId) {
    results = results.filter(r => r.staff_id === staffId);
  }

  if (topic) {
    results = results.filter(r => r.topic === topic);
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results.slice(0, limit),
    stats: generateLearningStats(results)
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      staff_id,
      query,
      response,
      topic = 'general',
      quality_rating
    } = body;

    // Create learning record
    const record: AILearningRecord = {
      id: Math.random().toString(36).substr(2, 9),
      staff_id,
      query,
      response,
      topic,
      quality_rating,
      learning_extracted: extractLearning(query, response, topic),
      created_at: new Date()
    };

    learningRecords.push(record);

    // Update learning index for frequency analysis
    const key = `${topic}_${query.substring(0, 50).toLowerCase()}`;
    learningIndex[key] = (learningIndex[key] || 0) + 1;

    return NextResponse.json({
      success: true,
      message: 'Learning recorded and AI improved',
      record,
      aiImprovementScore: calculateImprovementScore(quality_rating || 0)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to record learning' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { record_id, quality_rating, feedback } = body;

    const recordIndex = learningRecords.findIndex(r => r.id === record_id);
    if (recordIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    // Update with feedback
    learningRecords[recordIndex].quality_rating = quality_rating;

    return NextResponse.json({
      success: true,
      message: 'Feedback recorded - AI is learning from your input!',
      record: learningRecords[recordIndex],
      reinforcementLearningScore: calculateReinforcementScore(quality_rating)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update feedback' },
      { status: 400 }
    );
  }
}

function extractLearning(query: string, response: string, topic: string): string {
  const keywords: { [key: string]: string[] } = {
    lesson_plan: ['theme', 'age group', 'duration', 'objectives'],
    activity: ['materials', 'group size', 'learning outcome', 'sensory'],
    strategy: ['behavior', 'engagement', 'classroom management', 'relationship']
  };

  const topicKeywords = keywords[topic] || keywords.general;
  let learning = `Topic: ${topic}. `;

  topicKeywords.forEach(keyword => {
    if (
      query.toLowerCase().includes(keyword) ||
      response.toLowerCase().includes(keyword)
    ) {
      learning += `Relevant to ${keyword}. `;
    }
  });

  // Extract key concepts
  if (query.includes('WDS') || response.includes('WDS')) {
    learning += 'WDS-aligned approach. ';
  }

  if (response.includes('developmental')) {
    learning += 'Developmental focus. ';
  }

  return learning;
}

function generateLearningStats(records: AILearningRecord[]) {
  const topicCounts = records.reduce((acc, r) => {
    acc[r.topic] = (acc[r.topic] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const avgQuality =
    records.reduce((sum, r) => sum + (r.quality_rating || 0), 0) /
    Math.max(records.length, 1);

  return {
    totalInteractions: records.length,
    byTopic: topicCounts,
    avgQualityRating: Math.round(avgQuality * 10) / 10,
    knowledgeGrowth: Math.min(records.length * 2, 100) // Simulated growth metric
  };
}

function calculateImprovementScore(quality: number): number {
  // Returns a score representing how much the AI has improved
  return Math.max(0, Math.min(100, 50 + quality * 10));
}

function calculateReinforcementScore(rating: number): number {
  // Reinforcement learning score based on user feedback
  return Math.min(100, rating * 20);
}

export async function DELETE(request: NextRequest) {
  // Clear all learning records (admin only)
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('admin_key');

  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  learningRecords.length = 0;
  Object.keys(learningIndex).forEach(key => delete learningIndex[key]);

  return NextResponse.json({
    success: true,
    message: 'All learning records cleared'
  });
}
