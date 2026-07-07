/**
 * Indexed Lesson Planning Resources Library
 * 
 * Comprehensive catalog of teaching materials, templates, and lesson plans
 * from C:\Users\carli\OneDrive\Documents\lesson planning
 * 
 * Organized by category for easy integration into lesson planning workflows
 */

export interface LessonResource {
  id: string
  title: string
  category: string
  subcategory?: string
  type: 'pdf' | 'template' | 'worksheet' | 'guide' | 'zip' | 'image' | 'pptx' | 'xls'
  gradeLevel?: string[]
  subject?: string
  description?: string
  keywords?: string[]
  filename: string
}

export const LESSON_PLANNING_RESOURCES: LessonResource[] = [
  // Lesson Plan Templates
  {
    id: '5e-model-template',
    title: 'Lesson Plan Template - 5E Instructional Model',
    category: 'Templates',
    subcategory: 'Lesson Plans',
    type: 'pdf',
    description: 'Comprehensive 5E model template (Engage, Explore, Explain, Elaborate, Evaluate)',
    keywords: ['5E', 'inquiry-based', 'instructional model', 'template'],
    filename: 'LessonPlanTemplate5EInstructionalModelEngageExploreExplainElaborate-1.pdf',
  },
  {
    id: 'middle-high-school-weekly',
    title: 'Middle or High School Weekly Lesson Plan Template',
    category: 'Templates',
    subcategory: 'Lesson Plans',
    type: 'pptx',
    gradeLevel: ['6', '7', '8', '9', '10', '11', '12'],
    description: 'Simple and editable weekly lesson plan template for secondary education',
    keywords: ['secondary', 'weekly', 'editable', 'lesson plan'],
    filename: 'MiddleorHighSchoolWeeklyLessonPlanTemplateSimpleandEditable-1.pptx',
  },
  {
    id: 'middle-school-freebie',
    title: 'Middle School Lesson Plan Template Freebie',
    category: 'Templates',
    subcategory: 'Lesson Plans',
    type: 'pdf',
    gradeLevel: ['6', '7', '8'],
    description: 'Free middle school lesson plan template',
    keywords: ['middle school', 'free', 'freebie', 'template'],
    filename: 'MiddleSchoolLessonPlanTemplateFreebie-1.pdf',
  },

  // Physical Education Resources
  {
    id: 'pe-heart-rate-lesson',
    title: 'FREE PE Lesson: Heart Rate for Health and Wellness',
    category: 'Lesson Plans',
    subcategory: 'Physical Education',
    type: 'zip',
    gradeLevel: ['K', '1', '2', '3'],
    subject: 'Physical Education',
    description: 'Complete PE lesson focusing on heart rate and health awareness',
    keywords: ['PE', 'health', 'fitness', 'heart rate', 'wellness'],
    filename: 'FREEPELessonHeartRateLessonforHealthandWellnessorPEClass-1.zip',
  },
  {
    id: 'pe-sport-lesson-k3',
    title: 'Free PE Sport Lesson Ideas - Games, Stations, Relays (K-3)',
    category: 'Lesson Plans',
    subcategory: 'Physical Education',
    type: 'zip',
    gradeLevel: ['K', '1', '2', '3'],
    subject: 'Physical Education',
    description: 'Collection of PE games, stations, and relay activities for elementary',
    keywords: ['PE', 'games', 'stations', 'relays', 'elementary'],
    filename: 'FreePESportLessonideasGamesStationsRelaysGradesK3-1.zip',
  },
  {
    id: 'pe-tag-games-k2',
    title: 'FREE Kindergarten Grade 2 PE Sport Lesson - Tag Games',
    category: 'Lesson Plans',
    subcategory: 'Physical Education',
    type: 'zip',
    gradeLevel: ['K', '1', '2'],
    subject: 'Physical Education',
    description: 'Collection of tag-based games for elementary PE classes',
    keywords: ['PE', 'tag games', 'elementary', 'games'],
    filename: '6FREEKindergartenGrade2PESportlessonTipTagElementaryGames-1.zip',
  },
  {
    id: 'pe-fitness-worksheet',
    title: 'FREE Physical Education Worksheet - Fitness in Our Daily Lives',
    category: 'Worksheets',
    subcategory: 'Physical Education',
    type: 'zip',
    subject: 'Physical Education',
    description: 'Discussion and worksheet about fitness and daily wellness habits',
    keywords: ['PE', 'fitness', 'wellness', 'worksheet', 'discussion'],
    filename: 'FREEPhysicalEducationWorksheetDiscussionFitnessinourDailyLives-1.zip',
  },
  {
    id: 'pe-challenge-game-creation',
    title: 'PE Challenge - Create Your Own PE Game',
    category: 'Lesson Plans',
    subcategory: 'Physical Education',
    type: 'pdf',
    subject: 'Physical Education',
    description: 'Creative project for students to design and test their own PE games',
    keywords: ['PE', 'creative', 'challenge', 'game design'],
    filename: 'PEChallengeCreateYourOwnPEGame-1.pdf',
  },
  {
    id: 'elementary-pe-starter-pack',
    title: 'Teaching Elementary Physical Education - Starter Pack',
    category: 'Guides',
    subcategory: 'Physical Education',
    type: 'zip',
    gradeLevel: ['K', '1', '2', '3'],
    subject: 'Physical Education',
    description: 'Comprehensive starter pack with lessons and games for elementary PE',
    keywords: ['PE', 'elementary', 'starter', 'games', 'lessons'],
    filename: 'TeachingElementaryPhysicalEducationFreestarterpacklessonsgames-1.zip',
  },

  // Music Lessons
  {
    id: 'music-lesson-templates',
    title: 'Elementary & Middle School Music Lesson Plan Templates - FREE',
    category: 'Templates',
    subcategory: 'Music',
    type: 'zip',
    gradeLevel: ['3', '4', '5', '6', '7', '8'],
    subject: 'Music',
    description: 'Comprehensive collection of free music lesson plan templates',
    keywords: ['music', 'lesson plans', 'elementary', 'middle school', 'templates'],
    filename: 'ElementaryMiddleSchoolMusicLessonPlanTemplatesFREE-1.zip',
  },

  // Literacy & Writing Resources
  {
    id: 'nonfiction-writers',
    title: 'Calling All Nonfiction Writers - Essay Structure Lesson',
    category: 'Lesson Plans',
    subcategory: 'Writing',
    type: 'pdf',
    gradeLevel: ['4', '5'],
    subject: 'Language Arts',
    description: 'Comprehensive lesson on essay structure with graphic organizers for 4th-5th grade',
    keywords: ['writing', 'essays', 'nonfiction', 'structure', 'graphic organizers'],
    filename: '_usr_local_src_education.com_files_static_lesson-plans_calling-all-nonfiction-writers_calling-all-nonfiction-writers.pdf',
  },
  {
    id: 'literacy-training-notes',
    title: 'Free Notes and Literacy Training for Teachers',
    category: 'Professional Development',
    subcategory: 'Literacy',
    type: 'zip',
    description: 'Professional development materials for teaching literacy',
    keywords: ['literacy', 'training', 'professional development', 'reading'],
    filename: 'FreeNotesandLiteracyTrainingforTeachers-1.zip',
  },
  {
    id: 'academic-vocabulary',
    title: '23 Tips for Teaching Academic Vocabulary - FREE',
    category: 'Guides',
    subcategory: 'Vocabulary',
    type: 'pdf',
    description: 'Research-based strategies for teaching academic vocabulary effectively',
    keywords: ['vocabulary', 'academic', 'tips', 'strategies', 'ELL'],
    filename: 'FREE23TipsforTeachingAcademicVocabulary-1.pdf',
  },

  // EL/ESL Support
  {
    id: 'el-numbers-lesson',
    title: 'EL Support Lesson Plan - 1, 2, 3 Numbers!',
    category: 'Lesson Plans',
    subcategory: 'EL/ESL',
    type: 'pdf',
    gradeLevel: ['K'],
    subject: 'Mathematics',
    description: 'Scaffolded lesson plan for teaching numbers 1-10 to ESL learners',
    keywords: ['ESL', 'ELL', 'numbers', 'kindergarten', 'math', 'language objectives'],
    filename: '_usr_local_src_education.com_files_static_lesson-plans_el-support-lesson-1-2-3-numbers_el-support-lesson-1-2-3-numbers.pdf',
  },

  // Character & Social Emotional Learning
  {
    id: 'character-traits-lesson',
    title: 'Character Traits - It\'s All in the Personality',
    category: 'Lesson Plans',
    subcategory: 'Reading/Literature',
    type: 'pdf',
    gradeLevel: ['3', '4'],
    subject: 'Language Arts',
    description: 'Comprehensive lesson on character trait analysis with graphic organizers',
    keywords: ['character', 'traits', 'reading', 'text evidence', 'graphic organizers'],
    filename: '_usr_local_src_education.com_files_static_lesson-plans_its-all-in-the-personality-character-traits_its-all-in-the-personality-character-traits.pdf',
  },
  {
    id: 'positive-self-talk',
    title: 'Building Confidence - Positive Self-Talk & Daily Affirmations',
    category: 'Lesson Plans',
    subcategory: 'Social Emotional Learning',
    type: 'pdf',
    subject: 'Social-Emotional',
    description: 'Lesson plan focused on building student confidence through affirmations',
    keywords: ['SEL', 'confidence', 'self-talk', 'affirmations', 'mental health'],
    filename: 'BuildingConfidencePositiveSelfTalkDailyAffirmationsforKids-1.pdf',
  },
  {
    id: 'smiley-flower-behavior',
    title: 'Smiley Flower - Build Me Up Behavior & Classroom Management',
    category: 'Tools',
    subcategory: 'Behavior Management',
    type: 'pdf',
    description: 'Creative behavior management tool using positive reinforcement',
    keywords: ['behavior', 'classroom management', 'positive', 'rewards'],
    filename: 'FREESmileyFlowerBuildMeUpBehaviorSaverGroovyClassroomManagementtool-1.pdf',
  },

  // Assessment & Tracking Tools
  {
    id: 'classroom-data-tracker',
    title: 'Classroom Data Tracker - NWEA iReady',
    category: 'Tools',
    subcategory: 'Assessment',
    type: 'pdf',
    description: 'Dashboard tool for tracking student assessment data',
    keywords: ['assessment', 'data', 'tracking', 'NWEA', 'iReady'],
    filename: 'ClassroomDataTrackerNWEAiReady-1.pdf',
  },
  {
    id: 'walkthrough-observation-form',
    title: 'Classroom Walkthrough Observation Form & Data Analysis',
    category: 'Tools',
    subcategory: 'Observation',
    type: 'pdf',
    description: 'Professional observation and data analysis dashboard for classroom walkthroughs',
    keywords: ['observation', 'walkthrough', 'data analysis', 'professional development'],
    filename: 'ClassroomWalkthroughObservationFormDataAnalysisDashboardTool-1.pdf',
  },
  {
    id: 'smart-goals-template',
    title: 'SMART Goals Template for Students',
    category: 'Templates',
    subcategory: 'Goal Setting',
    type: 'pdf',
    description: 'Student goal-setting template using SMART framework',
    keywords: ['goals', 'SMART', 'student', 'planning', 'achievement'],
    filename: 'SMARTGoalsTemplateforStudents-1.pdf',
  },
  {
    id: 'goal-setting-kindergarten',
    title: 'Goal Setting - Kindergarten Worksheets & Progress Tracking',
    category: 'Worksheets',
    subcategory: 'Goal Setting',
    type: 'zip',
    gradeLevel: ['K'],
    description: 'Age-appropriate goal setting and assessment materials for kindergarten',
    keywords: ['goal setting', 'kindergarten', 'assessment', 'progress tracking'],
    filename: 'GoalSettingKindergartenWorksheetsIndividualAssessmentProgressTracking-1.zip',
  },

  // Special Education & Hygiene
  {
    id: 'hygiene-sequencing',
    title: 'FREE Hygiene Sequencing Worksheet - Special Education',
    category: 'Worksheets',
    subcategory: 'Life Skills',
    type: 'pdf',
    description: 'Sequencing worksheet for teaching hygiene skills to special education students',
    keywords: ['special education', 'life skills', 'hygiene', 'sequencing'],
    filename: 'FREEHygieneSequencingWorksheetLifeSkillsSampleforSpecialEducation-1.pdf',
  },

  // Coaching & Professional Development
  {
    id: 'instructional-coaching-guide',
    title: 'Instructional Coaching Startup Guide - Planning Forms',
    category: 'Professional Development',
    subcategory: 'Coaching',
    type: 'pdf',
    description: 'Comprehensive guide for new instructional coaches with planning templates',
    keywords: ['coaching', 'professional development', 'teacher support', 'forms'],
    filename: 'InstructionalCoachingStartUpGuideFreePlanningFormsforNewCoaches-1.pdf',
  },
  {
    id: 'instructional-coaching-menu',
    title: 'Instructional Coaching Menu - Teacher Support Templates',
    category: 'Professional Development',
    subcategory: 'Coaching',
    type: 'pdf',
    description: 'Menu of instructional coaching strategies and support tools',
    keywords: ['coaching', 'teacher support', 'strategies', 'professional development'],
    filename: 'InstructionalCoachingMenuFREEBIE-1.pdf',
  },
  {
    id: 'coaching-reflection-form',
    title: 'Instructional Coaching Reflection Form',
    category: 'Professional Development',
    subcategory: 'Coaching',
    type: 'pdf',
    description: 'Reflection tool for instructional coaches and teachers',
    keywords: ['coaching', 'reflection', 'professional development'],
    filename: 'InstructionalCoachingReflectionForm-1.pdf',
  },
  {
    id: 'coaching-questionnaire',
    title: 'Instructional Coaching Questionnaire',
    category: 'Professional Development',
    subcategory: 'Coaching',
    type: 'pdf',
    description: 'Assessment tool for coaching needs and effectiveness',
    keywords: ['coaching', 'assessment', 'questionnaire', 'needs analysis'],
    filename: 'InstructionalCoachingQuestionaire-1.pdf',
  },
  {
    id: 'classroom-meeting-notes',
    title: 'Instructional Coaching Forms - Classroom Management Meeting Notes',
    category: 'Professional Development',
    subcategory: 'Coaching',
    type: 'pdf',
    description: 'Meeting notes template for classroom management coaching conversations',
    keywords: ['coaching', 'meeting notes', 'classroom management'],
    filename: 'InstructionalCoachingFormsClassroomManagementMeetingNotesFREEBIE-1.pdf',
  },
  {
    id: 'student-engagement-tool',
    title: 'Instructional Strategies for Student Engagement Tool',
    category: 'Tools',
    subcategory: 'Instruction',
    type: 'xls',
    description: 'Spreadsheet tool for tracking and planning student engagement strategies',
    keywords: ['engagement', 'instructional strategies', 'tool'],
    filename: 'InstructionalStrategiesforStudentEngagementTool-1.xls',
  },
  {
    id: 'mentor-support-booklet',
    title: 'FREE Mentor and Support Booklet - New Trainee & First Year Teachers',
    category: 'Professional Development',
    subcategory: 'New Teacher Support',
    type: 'zip',
    description: 'Comprehensive support materials for new and first-year teachers',
    keywords: ['new teacher', 'mentoring', 'support', 'professional development'],
    filename: 'FREEMentorandSupportBookletforNewTraineeandFirstYearTeachers-1.zip',
  },
  {
    id: 'peer-observation',
    title: 'Professional Development - Peer Observation for Teachers',
    category: 'Professional Development',
    subcategory: 'Observation',
    type: 'pdf',
    description: 'Guide and tools for implementing peer observation among teachers',
    keywords: ['peer observation', 'professional development', 'collaboration'],
    filename: 'ProfessionalDevelopmentPeerObservationforTeachers-1.pdf',
  },

  // Portfolio & Assessment
  {
    id: 'teaching-portfolio-artifacts',
    title: 'Teaching Portfolio Artifacts for Danielson Model',
    category: 'Professional Development',
    subcategory: 'Portfolio',
    type: 'pdf',
    description: 'Framework for collecting portfolio artifacts aligned to Danielson model',
    keywords: ['portfolio', 'Danielson', 'teacher evaluation', 'artifacts'],
    filename: 'TeachingPortfolioArtifactsforDanielsonModel-1.pdf',
  },
  {
    id: 'teacher-reflection-checklist',
    title: 'Teacher Reflection Checklist - Project Approach & PBL',
    category: 'Professional Development',
    subcategory: 'Reflection',
    type: 'pdf',
    description: 'Reflection tool for project-based and project approach learning',
    keywords: ['reflection', 'project-based learning', 'inquiry', 'checklist'],
    filename: 'TeacherReflectionChecklistProjectApproachandProjectBasedLearning-1.pdf',
  },

  // Classroom Culture & Staff
  {
    id: 'disney-quotes',
    title: 'Disney Quotes for Classroom',
    category: 'Resources',
    subcategory: 'Classroom Decor',
    type: 'pdf',
    description: 'Inspirational Disney quotes for classroom motivation and culture',
    keywords: ['quotes', 'motivation', 'classroom culture', 'inspiration'],
    filename: 'DisneyQuotesforClassroom-1.pdf',
  },
  {
    id: 'teacher-appreciation-notes',
    title: 'Teacher Appreciation & Encouragement Notes',
    category: 'Resources',
    subcategory: 'Staff Culture',
    type: 'pdf',
    description: 'Templates for showing teacher appreciation and encouragement',
    keywords: ['appreciation', 'encouragement', 'staff morale', 'notes'],
    filename: 'TeacherAppreciationandEncouragementNotesforSpreadingSparkle-1.pdf',
  },
  {
    id: 'been-penned-staff',
    title: 'You\'ve Been Penned - Staff Morale Booster',
    category: 'Resources',
    subcategory: 'Staff Culture',
    type: 'pdf',
    description: 'Staff sunshine and morale-boosting activity',
    keywords: ['staff morale', 'morale booster', 'sunshine', 'culture'],
    filename: 'YouveBeenPennedforStaffMoraleBoosterStaffSunshine-1.pdf',
  },
  {
    id: 'staff-questionnaire',
    title: 'I\'d Like to Get to Know You - Staff Questionnaire',
    category: 'Resources',
    subcategory: 'Staff Culture',
    type: 'pdf',
    description: 'Getting-to-know-you questionnaire for staff bonding',
    keywords: ['staff', 'questionnaire', 'bonding', 'community building'],
    filename: 'IdLiketoGettoKnowYouStaffQuestionnaire-1.pdf',
  },
  {
    id: 'positive-notes-coaching',
    title: 'Positive Notes from Your Instructional Coach - FREEBIE',
    category: 'Professional Development',
    subcategory: 'Coaching',
    type: 'pdf',
    description: 'Notes for delivering positive feedback to teachers',
    keywords: ['coaching', 'positive feedback', 'encouragement'],
    filename: 'PositiveNotesfromYourInstructionalCoachFREEBIE-1.pdf',
  },

  // Worksheets & Activities
  {
    id: 'field-day-coloring',
    title: 'Field Day Fun - FREE Coloring & Writing Sheets',
    category: 'Worksheets',
    subcategory: 'Activities',
    type: 'pdf',
    description: 'Coloring and writing worksheets themed around field day',
    keywords: ['field day', 'coloring', 'writing', 'worksheets'],
    filename: 'FieldDayFunFREEBIEColoringandWritingSheets-1.pdf',
  },
  {
    id: 'zoo-animals-coloring',
    title: 'Zoo Animals - Coloring Pages & Craft Activities',
    category: 'Worksheets',
    subcategory: 'Activities',
    type: 'zip',
    gradeLevel: ['K', '1', '2', '3'],
    description: 'Collection of zoo-themed coloring pages and craft activities',
    keywords: ['zoo', 'animals', 'coloring', 'crafts', 'activities'],
    filename: 'zooanimalsColoringPagesCraftActivities-1.zip',
  },
  {
    id: 'soccer-coloring',
    title: 'Soccer Collage Coloring Page',
    category: 'Worksheets',
    subcategory: 'Activities',
    type: 'image',
    description: 'Soccer-themed coloring page for sports units',
    keywords: ['soccer', 'coloring', 'sports', 'image'],
    filename: 'SoccerCollageColoringPage-1.png',
  },

  // Research & Resources
  {
    id: 'faar-infographic',
    title: 'FAAR Educator Infographic',
    category: 'Resources',
    subcategory: 'Research',
    type: 'pdf',
    description: 'Research-based infographic for educators',
    keywords: ['FAAR', 'research', 'infographic', 'professional'],
    filename: 'FAAR_educator_infographic_Online.pdf',
  },
  {
    id: 'highlights-program-evaluation',
    title: 'Highlights 2018 Program Evaluation',
    category: 'Resources',
    subcategory: 'Research',
    type: 'pdf',
    description: 'Program evaluation research and findings',
    keywords: ['evaluation', 'research', 'program', 'effectiveness'],
    filename: 'Highlights_2018_Program_Evaluation.pdf',
  },
  {
    id: 'expansion-recasting-resource',
    title: 'Expansion & Recasting - Parent Resource Handout',
    category: 'Resources',
    subcategory: 'Language Development',
    type: 'pdf',
    description: 'Parent guide for language expansion and recasting strategies',
    keywords: ['language', 'recasting', 'parent resource', 'communication'],
    filename: 'ExpansionRecastingParentResourceHandout-1.pdf',
  },
  {
    id: 'vts-responsible-choices',
    title: 'VTS Educational Guide - Building Confidence for Responsible Choices',
    category: 'Guides',
    subcategory: 'SEL',
    type: 'pdf',
    description: 'Visual Thinking Strategies guide for SEL and decision-making',
    keywords: ['VTS', 'SEL', 'responsible choices', 'visual thinking', 'guide'],
    filename: 'RESP-Ask-Listen-Learn-VTSEdGuide-BuildingConfidenceForResponsibleChoices-V1.0.pdf',
  },
]

/**
 * Get resources by category
 */
export function getResourcesByCategory(category: string): LessonResource[] {
  return LESSON_PLANNING_RESOURCES.filter(r => r.category === category)
}

/**
 * Get resources by subject
 */
export function getResourcesBySubject(subject: string): LessonResource[] {
  return LESSON_PLANNING_RESOURCES.filter(r => r.subject === subject)
}

/**
 * Get resources by grade level
 */
export function getResourcesByGradeLevel(grade: string): LessonResource[] {
  return LESSON_PLANNING_RESOURCES.filter(r => 
    r.gradeLevel && r.gradeLevel.includes(grade)
  )
}

/**
 * Search resources by keywords
 */
export function searchResources(query: string): LessonResource[] {
  const lowerQuery = query.toLowerCase()
  return LESSON_PLANNING_RESOURCES.filter(r =>
    r.title.toLowerCase().includes(lowerQuery) ||
    r.description?.toLowerCase().includes(lowerQuery) ||
    r.keywords?.some(k => k.toLowerCase().includes(lowerQuery)) ||
    r.category.toLowerCase().includes(lowerQuery) ||
    r.subcategory?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return [...new Set(LESSON_PLANNING_RESOURCES.map(r => r.category))].sort()
}

/**
 * Get all unique subjects
 */
export function getSubjects(): string[] {
  return [...new Set(
    LESSON_PLANNING_RESOURCES
      .filter(r => r.subject)
      .map(r => r.subject as string)
  )].sort()
}

/**
 * Get all unique grade levels
 */
export function getGradeLevels(): string[] {
  const grades = new Set<string>()
  LESSON_PLANNING_RESOURCES.forEach(r => {
    if (r.gradeLevel) {
      r.gradeLevel.forEach(g => grades.add(g))
    }
  })
  return Array.from(grades).sort((a, b) => {
    const order = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    return order.indexOf(a) - order.indexOf(b)
  })
}

/**
 * Get resource by ID
 */
export function getResourceById(id: string): LessonResource | undefined {
  return LESSON_PLANNING_RESOURCES.find(r => r.id === id)
}

/**
 * Get resources statistics
 */
export function getResourcesStats() {
  return {
    total: LESSON_PLANNING_RESOURCES.length,
    byCategory: Object.fromEntries(
      getCategories().map(cat => [
        cat,
        getResourcesByCategory(cat).length
      ])
    ),
    byType: Object.fromEntries(
      [...new Set(LESSON_PLANNING_RESOURCES.map(r => r.type))].map(type => [
        type,
        LESSON_PLANNING_RESOURCES.filter(r => r.type === type).length
      ])
    ),
  }
}
