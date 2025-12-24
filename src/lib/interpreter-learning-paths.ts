/**
 * Medical Interpreter Learning Paths
 * Structured, measurable training paths for InterpreStudy
 */

import { LearningPath, LearningModule } from '@/types/learning-path';
import { PATH_BADGES } from '@/types/interpreter-badges';

// ============================================================================
// INTERPRETER LEARNING PATHS
// ============================================================================

export const INTERPRETER_LEARNING_PATHS: Record<string, LearningPath> = {
  // ========================================================================
  // PATH 1: FOUNDATIONAL SKILLS
  // ========================================================================
  'foundational-skills': {
    id: 'foundational-skills',
    title: 'Foundational Skills for Medical Interpreters',
    description:
      'Master the core competencies every medical interpreter needs: DCS Schema, ethics, cultural competency, and professional standards.',
    category: 'core-skills',
    difficulty: 'beginner',
    estimatedHours: 20,
    prerequisites: [],
    badge: PATH_BADGES['dcs-training'],
    isActive: true,
    orderIndex: 1,
    modules: [
      {
        id: 'dcs-schema-basics',
        pathId: 'foundational-skills',
        title: 'DCS Schema Training',
        description:
          'Master the Dynamic Conceptual Schema (Demand Control Schema) - the foundation of professional interpretation.',
        estimatedTime: 120,
        points: 150,
        orderIndex: 1,
        isLocked: false,
        activities: [
          {
            id: 'dcs-intro-reading',
            type: 'reading',
            title: 'Introduction to DCS Schema',
            points: 20,
            data: {
              content: `# Understanding the Dynamic Conceptual Schema (DCS)

The Demand Control Schema is a cognitive framework that helps interpreters manage the complex demands of medical interpretation. Unlike simple word-for-word translation, DCS teaches you to:

## Core Principles

**1. Message Analysis**
Break down the source message to understand its core meaning, not just words.

**2. Reformulation**
Reconstruct the message in the target language while preserving meaning, register, and intent.

**3. Cultural Mediation**
Navigate cultural differences that affect communication in healthcare settings.

**4. Memory Management**
Use cognitive strategies to retain and process information during interpretation.

## The Three Demands

### Linguistic Demands
Understanding and producing accurate language in both source and target languages.

### Paralinguistic Demands
Managing tone, register, and non-verbal communication.

### Extralinguistic Demands
Navigating cultural context, medical knowledge, and situational factors.

## Control Strategies

DCS isn't just about recognizing demands - it's about developing control strategies to manage them:

- **Preparation**: Pre-session research and terminology review
- **Positioning**: Physical and professional positioning in the encounter
- **Memory aids**: Note-taking and chunking techniques
- **Repair strategies**: Self-correction and clarification requests

As an interpreter, you are the bridge. DCS gives you the structural framework to build that bridge effectively.`,
              estimatedTime: 15,
            },
          },
          {
            id: 'dcs-vocabulary',
            type: 'vocabulary',
            title: 'DCS Core Concepts',
            points: 20,
            data: {
              items: [
                {
                  term: 'Demand Control Schema (DCS)',
                  definition:
                    'A cognitive framework for managing the multiple demands of interpretation',
                },
                {
                  term: 'Message Analysis',
                  definition: 'Breaking down source language to understand core meaning',
                },
                {
                  term: 'Reformulation',
                  definition: 'Reconstructing meaning in target language while preserving intent',
                },
                {
                  term: 'Register',
                  definition: 'Level of formality and style appropriate to the context',
                },
                {
                  term: 'Chunking',
                  definition: 'Breaking information into manageable segments for processing',
                },
                {
                  term: 'Cultural Mediation',
                  definition: 'Facilitating understanding across cultural differences',
                },
                {
                  term: 'Control Strategies',
                  definition: 'Techniques to manage interpretation demands',
                },
                {
                  term: 'Parallel Processing',
                  definition: 'Simultaneous listening and speaking during interpretation',
                },
              ],
            },
          },
          {
            id: 'dcs-expandable',
            type: 'expandable',
            title: 'DCS Strategies Deep Dive',
            points: 25,
            data: {
              cards: [
                {
                  title: 'Message Analysis Techniques',
                  summary: 'How to deconstruct source messages',
                  content:
                    'Effective message analysis involves: 1) Identifying the main idea, 2) Recognizing supporting details, 3) Understanding the speaker\'s intent, 4) Noting register and tone, 5) Identifying cultural context. Practice by listening to statements and asking: "What is the speaker really trying to communicate?"',
                },
                {
                  title: 'Reformulation Strategies',
                  summary: 'Reconstructing meaning accurately',
                  content:
                    'Reformulation is not translation - it\'s meaning transfer. Key strategies: 1) Use natural target language patterns, 2) Maintain register equivalence, 3) Preserve emotional tone, 4) Adapt cultural references when necessary, 5) Ensure medical accuracy. The goal is functional equivalence, not word-for-word matching.',
                },
                {
                  title: 'Memory Management',
                  summary: 'Cognitive techniques for retention',
                  content:
                    'Professional interpreters use: 1) Chunking - breaking information into 7±2 item segments, 2) Visualization - creating mental images, 3) Logical linking - connecting ideas conceptually, 4) Note-taking - strategic symbol systems, 5) Active listening - focusing on meaning over words.',
                },
                {
                  title: 'Cultural Mediation in Practice',
                  summary: 'Navigating cultural differences',
                  content:
                    'Cultural mediation requires: 1) Recognizing when cultural gaps exist, 2) Alerting parties to potential misunderstandings, 3) Providing cultural context when appropriate, 4) Maintaining impartiality, 5) Knowing when to clarify vs. when to interpret directly. This is one of the most nuanced interpreter skills.',
                },
              ],
            },
          },
          {
            id: 'dcs-scenario-practice',
            type: 'scenario',
            title: 'DCS Application Scenario',
            points: 30,
            data: {
              scenario:
                'A Spanish-speaking patient says: "Me duele mucho aquí" (pointing to chest). The physician asks: "Can you describe the pain? Is it sharp, dull, burning?" Practice applying DCS: 1) Analyze both messages, 2) Consider cultural context of pain description, 3) Reformulate appropriately, 4) Manage the back-and-forth flow.',
              roles: ['Patient', 'Provider', 'Interpreter'],
              difficulty: 'medium',
              timeLimit: 5,
            },
          },
          {
            id: 'dcs-quiz',
            type: 'quiz',
            title: 'DCS Knowledge Check',
            points: 25,
            data: {
              questions: [
                {
                  question: 'What is the primary purpose of the DCS framework?',
                  options: [
                    'To translate word-for-word accurately',
                    'To manage the multiple demands of interpretation cognitively',
                    'To speak faster during interpretation',
                    'To memorize medical terminology',
                  ],
                  correctAnswer: 'To manage the multiple demands of interpretation cognitively',
                  explanation:
                    'DCS provides a cognitive framework for managing linguistic, paralinguistic, and extralinguistic demands simultaneously.',
                },
                {
                  question: 'What does "reformulation" mean in the DCS context?',
                  options: [
                    "Changing the speaker's message to make it clearer",
                    'Reconstructing meaning in the target language while preserving intent',
                    'Simplifying medical terminology',
                    'Adding your own explanation to the interpretation',
                  ],
                  correctAnswer: 'Reconstructing meaning in the target language while preserving intent',
                  explanation:
                    "Reformulation is about meaning transfer, not word-for-word translation. It preserves the speaker's intent and register.",
                },
                {
                  question: 'When should cultural mediation be used?',
                  options: [
                    'Always, for every sentence',
                    'Never - just interpret what is said',
                    'When cultural gaps might cause misunderstanding',
                    'Only when specifically asked by the provider',
                  ],
                  correctAnswer: 'When cultural gaps might cause misunderstanding',
                  explanation:
                    'Cultural mediation is used strategically when cultural context is needed to prevent misunderstanding, always maintaining impartiality.',
                },
              ],
            },
          },
          {
            id: 'dcs-practice-conversation',
            type: 'conversation',
            title: 'DCS Practice: Real-Time Simulation',
            points: 30,
            data: {
              scenario:
                'Provider explaining diabetes management to a patient. Practice using DCS principles in real-time interpretation.',
              responseWindow: 8,
              turns: 10,
            },
          },
        ],
      },
      {
        id: 'ethics-standards',
        pathId: 'foundational-skills',
        title: 'Code of Ethics & Professional Standards',
        description: 'Master the NCIHC Standards of Practice and Code of Ethics for medical interpreters.',
        estimatedTime: 90,
        points: 120,
        orderIndex: 2,
        isLocked: false,
        activities: [
          {
            id: 'ethics-reading',
            type: 'reading',
            title: 'NCIHC Standards of Practice',
            points: 20,
            data: {
              content: `# Code of Ethics for Medical Interpreters

## The NCIHC Standards

The National Council on Interpreting in Health Care (NCIHC) establishes the ethical foundation for medical interpretation.

### Core Principles

**1. Accuracy**
Convey the message completely and without adding, omitting, or changing anything.

**2. Confidentiality**
Protect all privileged and confidential information (HIPAA compliance).

**3. Impartiality**
Remain neutral and avoid personal bias or judgment.

**4. Respect**
Treat all parties with dignity and professionalism.

**5. Cultural Awareness**
Recognize cultural factors affecting communication without imposing your views.

**6. Role Boundaries**
Understand your role and its limitations.

**7. Professional Development**
Commit to ongoing learning and skill refinement.

**8. Advocacy**
Know when and how to advocate for patient understanding.`,
              estimatedTime: 12,
            },
          },
          {
            id: 'ethics-quiz',
            type: 'quiz',
            title: 'Ethics Assessment',
            points: 25,
            data: {
              questions: [
                {
                  question: 'What is the most important principle in medical interpretation?',
                  options: ['Speed', 'Accuracy', 'Being helpful', 'Making everyone comfortable'],
                  correctAnswer: 'Accuracy',
                  explanation:
                    'Accuracy is paramount. All other principles support the goal of conveying messages completely and correctly.',
                },
                {
                  question: 'A family member asks you to explain what the doctor said. What do you do?',
                  options: [
                    'Explain it to them - they have a right to know',
                    'Politely decline citing confidentiality',
                    'Tell them to ask the doctor',
                    'Summarize without details',
                  ],
                  correctAnswer: 'Politely decline citing confidentiality',
                  explanation:
                    'Confidentiality is a core ethical principle. Information shared in the interpreted session stays in the session.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'cultural-competency',
        pathId: 'foundational-skills',
        title: 'Cultural Competency in Healthcare',
        description: 'Develop skills for navigating cultural differences in medical settings.',
        estimatedTime: 60,
        points: 90,
        orderIndex: 3,
        isLocked: false,
        activities: [
          {
            id: 'culture-reading',
            type: 'reading',
            title: 'Understanding Cultural Competency',
            points: 15,
            data: {
              content: `# Cultural Competency in Medical Interpretation

Cultural competency is not about knowing every cultural practice. It's about recognizing when culture affects communication and facilitating understanding across cultural divides.

## Key Areas

### Health Beliefs
Different cultures have different beliefs about causes of illness, appropriate treatments, and the role of family in healthcare decisions.

### Communication Styles
Direct vs. indirect communication, comfort with eye contact, personal space preferences, and attitudes toward authority figures all vary by culture.

### Decision Making
In some cultures, family or community consensus is required before medical decisions. In others, individual autonomy is paramount.

### Sensitive Topics
Discussions of mental health, reproductive health, death, and other topics may require cultural sensitivity.`,
              estimatedTime: 10,
            },
          },
        ],
      },
    ],
  },

  // ========================================================================
  // PATH 2: MEDICAL TERMINOLOGY
  // ========================================================================
  'medical-terminology': {
    id: 'medical-terminology',
    title: 'Medical Terminology Mastery',
    description:
      'Build comprehensive medical vocabulary across all major specialties for accurate medical interpretation.',
    category: 'specialization',
    difficulty: 'intermediate',
    estimatedHours: 40,
    prerequisites: ['foundational-skills'],
    badge: PATH_BADGES['terminology-master'],
    isActive: true,
    orderIndex: 2,
    modules: [
      {
        id: 'anatomy-basics',
        pathId: 'medical-terminology',
        title: 'Anatomy & Body Systems',
        description: 'Master anatomical terminology and body system vocabulary.',
        estimatedTime: 120,
        points: 150,
        orderIndex: 1,
        isLocked: false,
        activities: [
          {
            id: 'anatomy-vocabulary',
            type: 'vocabulary',
            title: 'Body Systems Vocabulary',
            points: 30,
            data: {
              items: [
                { term: 'Cardiovascular', definition: 'Relating to the heart and blood vessels' },
                { term: 'Pulmonary', definition: 'Relating to the lungs and respiratory system' },
                { term: 'Gastrointestinal', definition: 'Relating to the stomach and intestines' },
                { term: 'Musculoskeletal', definition: 'Relating to muscles and bones' },
                { term: 'Neurological', definition: 'Relating to the nervous system and brain' },
                { term: 'Endocrine', definition: 'Relating to hormone-producing glands' },
              ],
            },
          },
        ],
      },
      {
        id: 'specialty-terms',
        pathId: 'medical-terminology',
        title: 'Specialty Terminology',
        description: 'Learn vocabulary specific to medical specialties.',
        estimatedTime: 90,
        points: 120,
        orderIndex: 2,
        isLocked: false,
        activities: [
          {
            id: 'cardiology-terms',
            type: 'vocabulary',
            title: 'Cardiology Terms',
            points: 25,
            data: {
              items: [
                { term: 'Myocardial infarction', definition: 'Heart attack - death of heart muscle due to blocked blood flow' },
                { term: 'Arrhythmia', definition: 'Irregular heartbeat' },
                { term: 'Hypertension', definition: 'High blood pressure' },
                { term: 'Angioplasty', definition: 'Procedure to open blocked arteries' },
              ],
            },
          },
        ],
      },
    ],
  },

  // ========================================================================
  // PATH 3: SPECIALIZED SETTINGS
  // ========================================================================
  'specialized-settings': {
    id: 'specialized-settings',
    title: 'Specialized Healthcare Settings',
    description:
      'Develop expertise in interpreting across different healthcare environments.',
    category: 'specialization',
    difficulty: 'advanced',
    estimatedHours: 30,
    prerequisites: ['foundational-skills', 'medical-terminology'],
    badge: PATH_BADGES['mental-health-specialist'],
    isActive: true,
    orderIndex: 3,
    modules: [
      {
        id: 'emergency-department',
        pathId: 'specialized-settings',
        title: 'Emergency Department Interpretation',
        description: 'Handle high-pressure emergency situations with accuracy and composure.',
        estimatedTime: 90,
        points: 130,
        orderIndex: 1,
        isLocked: false,
        activities: [
          {
            id: 'ed-reading',
            type: 'reading',
            title: 'Emergency Interpretation Principles',
            points: 20,
            data: {
              content: `# Emergency Department Interpretation

The ED presents unique challenges: speed, high stakes, emotional intensity, and medical complexity.

## Key Principles

1. **Speed with Accuracy** - Fast interpretation without sacrificing precision
2. **Triage Terminology** - Understanding urgency levels and chief complaints
3. **Trauma Protocols** - Knowing common procedures and their vocabulary
4. **Family Communication** - Managing emotional family members while maintaining focus
5. **Consent Under Pressure** - Ensuring informed consent even in urgent situations`,
              estimatedTime: 10,
            },
          },
        ],
      },
      {
        id: 'mental-health',
        pathId: 'specialized-settings',
        title: 'Mental Health Interpretation',
        description: 'Navigate the sensitive terrain of psychiatric and psychological settings.',
        estimatedTime: 120,
        points: 150,
        orderIndex: 2,
        isLocked: false,
        activities: [
          {
            id: 'mh-reading',
            type: 'reading',
            title: 'Mental Health Interpretation Guide',
            points: 25,
            data: {
              content: `# Mental Health Interpretation

Interpreting in mental health settings requires additional sensitivity and specialized knowledge.

## Special Considerations

1. **Emotional Neutrality** - Maintaining composure during disturbing content
2. **Terminology Precision** - Distinguishing between lay and clinical terms
3. **Cultural Context** - Understanding how culture affects mental health expression
4. **Self-Care** - Managing vicarious trauma
5. **Confidentiality** - Extra vigilance with sensitive information`,
              estimatedTime: 15,
            },
          },
        ],
      },
    ],
  },
};

// Helper function to get all learning paths as an array
export function getAllLearningPaths(): LearningPath[] {
  return Object.values(INTERPRETER_LEARNING_PATHS);
}

// Helper function to get a specific learning path
export function getLearningPath(pathId: string): LearningPath | undefined {
  return INTERPRETER_LEARNING_PATHS[pathId];
}

// Helper function to get all modules for a path
export function getPathModules(pathId: string): LearningModule[] {
  const path = INTERPRETER_LEARNING_PATHS[pathId];
  return path?.modules || [];
}

// Calculate total points for a path
export function calculatePathTotalPoints(pathId: string): number {
  const modules = getPathModules(pathId);
  return modules.reduce((total, module) => total + module.points, 0);
}

// Calculate total estimated time for a path (in minutes)
export function calculatePathTotalTime(pathId: string): number {
  const modules = getPathModules(pathId);
  return modules.reduce((total, module) => total + module.estimatedTime, 0);
}
