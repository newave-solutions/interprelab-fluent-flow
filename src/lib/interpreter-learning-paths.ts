/**
 * Medical Interpreter Learning Paths
 * Structured, measurable training paths for InterpreStudy
 */

import { LearningPath, LearningModule } from './learning-path';
import { PATH_BADGES } from './interpreter-badges';

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
                    'Changing the speaker\'s message to make it clearer',
                    'Reconstructing meaning in the target language while preserving intent',
                    'Simplifying medical terminology',
                    'Adding your own explanation to the interpretation',
                  ],
                  correctAnswer: 'Reconstructing meaning in the target language while preserving intent',
                  explanation:
                    'Reformulation is about meaning transfer, not word-for-word translation. It preserves the speaker\'s intent and register.',
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
Know when and how to advocate for patient understanding.

## Common Ethical Dilemmas

### The Confidentiality Challenge
You interpret a session where you learn sensitive information. A family member asks you what was discussed. **What do you do?**
*Answer: Decline politely and explain your ethical obligation to confidentiality.*

### The Accuracy vs. Clarity Dilemma
The provider uses complex medical jargon. The patient looks confused. **What do you do?**
*Answer: Interpret accurately first, then request clarification: "The patient appears to need clarification. May I suggest explaining it differently?"*

### The Cultural Gap
The provider recommends treatment that conflicts with the patient's cultural beliefs. **What is your role?**
*Answer: Interpret accurately, alert both parties to the cultural factor if it's creating a barrier, but remain impartial about the decision.*`,
              estimatedTime: 12,
            },
          },
          {
            id: 'ethics-scenarios',
            type: 'expandable',
            title: 'Ethical Scenarios',
            points: 25,
            data: {
              cards: [
                {
                  title: 'Confidentiality Breach Request',
                  summary: 'Handling pressure to share information',
                  content:
                    'Scenario: A family member approaches you in the waiting room and asks what the doctor said. Response: "I understand your concern, but I am ethically bound to maintain confidentiality. I cannot discuss the session with anyone except the patient and provider. Please speak directly with [patient/provider]."',
                },
                {
                  title: 'Accuracy Under Pressure',
                  summary: 'When providers rush or simplify',
                  content:
                    'Scenario: A provider says "Just tell them to take the pill twice a day" without explaining the medication. Response: Interpret exactly what was said, then address the provider: "Excuse me, should I interpret your instruction as you stated it, or would you like to provide more details for the patient?"',
                },
                {
                  title: 'Role Boundary Violation',
                  summary: 'When asked to go beyond interpreting',
                  content:
                    'Scenario: The provider asks you to explain a medical concept because "you speak their language better." Response: "I can interpret your explanation, but I cannot provide medical information myself. Would you like to explain it, and I\'ll interpret?"',
                },
                {
                  title: 'Cultural Mediation vs. Impartiality',
                  summary: 'Balancing cultural context with neutrality',
                  content:
                    'Scenario: Cultural misunderstanding is causing communication breakdown. Response: "Excuse me, there may be a cultural factor affecting understanding. [Briefly explain the cultural context to both parties.] How would you like to proceed?" Then interpret the discussion that follows.',
                },
              ],
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
                {
                  question: 'When should you clarify a cultural misunderstanding?',
                  options: [
                    'Always - it\'s your job',
                    'Never - just interpret what is said',
                    'When it\'s creating a barrier to understanding',
                    'Only if specifically asked',
                  ],
                  correctAnswer: 'When it\'s creating a barrier to understanding',
                  explanation:
                    'Cultural mediation is used strategically when cultural factors are impeding communication, while maintaining impartiality.',
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

## Key Areas of Cultural Difference

### 1. Health Beliefs
Different cultures have varying beliefs about illness causes, appropriate treatments, and the role of healthcare providers.

### 2. Communication Styles
- Direct vs. indirect communication
- Eye contact norms
- Physical space and touch
- Expression of pain or emotion

### 3. Family Dynamics
- Decision-making authority
- Gender roles in healthcare
- Disclosure of diagnosis

### 4. Time Orientation
- Punctuality expectations
- Acute vs. preventive care perspectives

## Your Role as Cultural Bridge

You are not there to change beliefs or judge practices. You are there to:
1. Recognize cultural factors affecting communication
2. Alert parties when cultural gaps exist
3. Provide brief cultural context when needed
4. Facilitate mutual understanding
5. Maintain impartiality`,
              estimatedTime: 10,
            },
          },
          {
            id: 'culture-scenarios',
            type: 'scenario',
            title: 'Cultural Competency Scenarios',
            points: 30,
            data: {
              scenario:
                'Practice recognizing and addressing cultural factors in medical encounters across various situations.',
              roles: ['Patient (various cultural backgrounds)', 'Provider', 'Interpreter'],
              difficulty: 'medium',
            },
          },
          {
            id: 'culture-quiz',
            type: 'quiz',
            title: 'Cultural Competency Check',
            points: 20,
            data: {
              questions: [
                {
                  question: 'What is the interpreter\'s role regarding cultural differences?',
                  options: [
                    'Change the patient\'s cultural beliefs to match Western medicine',
                    'Ignore cultural differences and just interpret words',
                    'Facilitate understanding across cultural divides while remaining impartial',
                    'Always explain every cultural practice in detail',
                  ],
                  correctAnswer: 'Facilitate understanding across cultural divides while remaining impartial',
                  explanation:
                    'Interpreters help bridge cultural gaps without imposing their own views or changing either party\'s beliefs.',
                },
              ],
            },
          },
        ],
      },
    ],
  },

  // ========================================================================
  // PATH 2: REPRODUCTIVE HEALTH SYSTEMS
  // ========================================================================
  'reproductive-systems': {
    id: 'reproductive-systems',
    title: 'Reproductive Health Systems',
    description:
      'Master medical terminology and interpretation skills for reproductive health, obstetrics, and neonatal care.',
    category: 'specialization',
    difficulty: 'intermediate',
    estimatedHours: 15,
    prerequisites: ['foundational-skills'],
    badge: PATH_BADGES['reproductive-systems'],
    isActive: true,
    orderIndex: 2,
    modules: [
      {
        id: 'male-reproductive',
        pathId: 'reproductive-systems',
        title: 'Male Reproductive System',
        description: 'Anatomy, spermatogenesis, common pathologies, and terminology.',
        estimatedTime: 90,
        points: 100,
        orderIndex: 1,
        isLocked: false,
        activities: [
          {
            id: 'male-anatomy-reading',
            type: 'reading',
            title: 'Male Anatomy Overview',
            points: 15,
            data: {
              content: `# Male Reproductive System

## Primary Function
The male reproductive system produces sperm and delivers them to the female reproductive tract.

## Key Structures

**Testicles (Testes)**
- Egg-shaped glands in the scrotum
- Produce sperm (spermatogenesis)
- Produce testosterone

**Epididymis**
- Coiled tube where sperm mature and are stored
- Located on the back of each testicle

**Vas Deferens**
- Transport tube carrying sperm from epididymis to urethra
- Cut during vasectomy procedure

**Prostate Gland**
- Produces fluid that nourishes and protects sperm
- Part of seminal fluid (semen)

**Seminal Vesicles**
- Produce majority of seminal fluid
- Fluid contains fructose for sperm energy

## Common Pathologies

- Erectile dysfunction (ED)
- Benign prostatic hyperplasia (BPH)
- Prostatitis (inflammation of prostate)
- Testicular torsion
- Varicocele
- Hydrocele
- Cryptorchidism (undescended testicle)`,
              estimatedTime: 12,
            },
          },
          {
            id: 'male-terminology',
            type: 'terminology-drill',
            title: 'Male Reproductive Terminology',
            points: 25,
            data: {
              specialty: 'male-reproductive',
              terms: [
                {
                  english: 'Testicle / Testis',
                  spanish: 'Testículo',
                  context: 'The male gonad that produces sperm',
                },
                {
                  english: 'Scrotum',
                  spanish: 'Escroto',
                  context: 'The pouch of skin containing the testicles',
                },
                {
                  english: 'Spermatogenesis',
                  spanish: 'Espermatogénesis',
                  context: 'The process of sperm production',
                },
                {
                  english: 'Prostate',
                  spanish: 'Próstata',
                  context: 'Gland that produces seminal fluid',
                },
                {
                  english: 'Erectile dysfunction',
                  spanish: 'Disfunción eréctil',
                  context: 'Inability to achieve or maintain an erection',
                },
                {
                  english: 'Vasectomy',
                  spanish: 'Vasectomía',
                  context: 'Surgical sterilization by cutting the vas deferens',
                },
                {
                  english: 'Benign prostatic hyperplasia (BPH)',
                  spanish: 'Hiperplasia prostática benigna',
                  context: 'Non-cancerous enlargement of the prostate',
                },
                {
                  english: 'Testicular torsion',
                  spanish: 'Torsión testicular',
                  context: 'Twisting of the testicle that cuts off blood supply - EMERGENCY',
                },
              ],
            },
          },
          {
            id: 'male-flashcards',
            type: 'flashcard',
            title: 'Male Reproductive Flashcards',
            points: 20,
            data: {
              cards: [
                {
                  front: 'What is the medical term for a painful erection lasting more than 4 hours?',
                  back: 'Priapism - requires immediate medical attention',
                },
                {
                  front: 'What is cryptorchidism?',
                  back: 'Undescended testicle - testicle fails to descend into the scrotum',
                },
                {
                  front: 'Define varicocele',
                  back: 'Enlarged veins in the scrotum, similar to varicose veins',
                },
              ],
            },
          },
          {
            id: 'male-quiz',
            type: 'quiz',
            title: 'Male Reproductive Assessment',
            points: 20,
            data: {
              questions: [
                {
                  question: 'Which structure produces sperm?',
                  options: ['Prostate', 'Epididymis', 'Testicles', 'Vas deferens'],
                  correctAnswer: 'Testicles',
                  explanation: 'The testicles (testes) are responsible for spermatogenesis - sperm production.',
                },
                {
                  question: 'What is BPH?',
                  options: [
                    'Bacterial prostate infection',
                    'Benign prostatic hyperplasia - enlarged prostate',
                    'Blood pressure hypertension',
                    'Blocked penile hydraulics',
                  ],
                  correctAnswer: 'Benign prostatic hyperplasia - enlarged prostate',
                  explanation: 'BPH is non-cancerous enlargement of the prostate, common in aging men.',
                },
              ],
            },
          },
          {
            id: 'male-body-mapper',
            type: 'body-mapper',
            title: 'Male Anatomy Body Mapper',
            points: 20,
            data: {
              system: 'male-reproductive',
              terms: [
                'Testicle',
                'Epididymis',
                'Vas deferens',
                'Prostate',
                'Seminal vesicle',
                'Urethra',
                'Penis',
                'Scrotum',
              ],
            },
          },
        ],
      },
      {
        id: 'female-reproductive',
        pathId: 'reproductive-systems',
        title: 'Female Reproductive System',
        description: 'Anatomy, menstrual cycle, pregnancy, common pathologies, and terminology.',
        estimatedTime: 120,
        points: 130,
        orderIndex: 2,
        isLocked: false,
        activities: [
          {
            id: 'female-anatomy-reading',
            type: 'reading',
            title: 'Female Anatomy Overview',
            points: 15,
            data: {
              content: `# Female Reproductive System

## Primary Functions
- Produce eggs (ova)
- Facilitate fertilization
- Support pregnancy and fetal development
- Produce hormones (estrogen and progesterone)

## Key Structures

**Ovaries**
- Produce eggs through ovulation
- Produce estrogen and progesterone

**Fallopian Tubes (Oviducts)**
- Transport eggs from ovaries to uterus
- Site of fertilization

**Uterus (Womb)**
- Hollow, muscular organ where fetus develops
- Endometrium - inner lining that sheds during menstruation
- Myometrium - muscular layer

**Cervix**
- Lower portion of uterus
- Opens into vagina
- Dilates during labor

**Vagina**
- Birth canal
- Receptacle for penis during intercourse
- Exit for menstrual flow

## Menstrual Cycle
- Average 28 days (varies 21-35 days)
- Day 1: First day of period
- Ovulation: ~Day 14
- Controlled by hormones: FSH, LH, estrogen, progesterone

## Common Pathologies
- Polycystic ovary syndrome (PCOS)
- Endometriosis
- Uterine fibroids (leiomyomas)
- Ovarian cysts
- Pelvic inflammatory disease (PID)
- Cervical dysplasia`,
              estimatedTime: 15,
            },
          },
          {
            id: 'female-terminology',
            type: 'terminology-drill',
            title: 'Female Reproductive Terminology',
            points: 25,
            data: {
              specialty: 'female-reproductive',
              terms: [
                {
                  english: 'Ovary / Ovaries',
                  spanish: 'Ovario / Ovarios',
                  context: 'Female gon ads that produce eggs and hormones',
                },
                {
                  english: 'Fallopian tube',
                  spanish: 'Trompa de Falopio',
                  context: 'Tube that transports eggs to the uterus',
                },
                {
                  english: 'Uterus',
                  spanish: 'Útero / Matriz',
                  context: 'Womb where fetus develops',
                },
                {
                  english: 'Cervix',
                  spanish: 'Cérvix / Cuello uterino',
                  context: 'Lower part of uterus that opens to vagina',
                },
                {
                  english: 'Menstruation',
                  spanish: 'Menstruación / Periodo / Regla',
                  context: 'Monthly shedding of uterine lining',
                },
                {
                  english: 'Ovulation',
                  spanish: 'Ovulación',
                  context: 'Release of an egg from the ovary',
                },
                {
                  english: 'Endometriosis',
                  spanish: 'Endometriosis',
                  context: 'Uterine lining tissue grows outside the uterus',
                },
                {
                  english: 'Polycystic ovary syndrome (PCOS)',
                  spanish: 'Síndrome de ovario poliquístico',
                  context: 'Hormonal disorder with enlarged ovaries and cysts',
                },
              ],
            },
          },
          {
            id: 'female-flashcards',
            type: 'flashcard',
            title: 'Female Reproductive Flashcards',
            points: 20,
            data: {
              cards: [
                {
                  front: 'What is the endometrium?',
                  back: 'The inner lining of the uterus that thickens and sheds during menstruation',
                },
                {
                  front: 'What are uterine fibroids?',
                  back: 'Benign (non-cancerous) muscular tumors in the uterus',
                },
                {
                  front: 'What is PID?',
                  back: 'Pelvic Inflammatory Disease - infection of female reproductive organs',
                },
              ],
            },
          },
          {
            id: 'female-quiz',
            type: 'quiz',
            title: 'Female Reproductive Assessment',
            points: 30,
            data: {
              questions: [
                {
                  question: 'Where does fertilization typically occur?',
                  options: ['Uterus', 'Ovary', 'Fallopian tube', 'Cervix'],
                  correctAnswer: 'Fallopian tube',
                  explanation: 'Fertilization usually occurs in the fallopian tube as the egg travels to the uterus.',
                },
                {
                  question: 'What is endometriosis?',
                  options: [
                    'Cancer of the uterus',
                    'Uterine lining tissue growing outside the uterus',
                    'Inflammation of the ovaries',
                    'Absent menstrual periods',
                  ],
                  correctAnswer: 'Uterine lining tissue growing outside the uterus',
                  explanation:
                    'Endometriosis occurs when endometrial tissue grows in places other than the uterine lining, causing pain.',
                },
              ],
            },
          },
          {
            id: 'female-body-mapper',
            type: 'body-mapper',
            title: 'Female Anatomy Body Mapper',
            points: 20,
            data: {
              system: 'female-reproductive',
              terms: [
                'Ovary',
                'Fallopian tube',
                'Uterus',
                'Cervix',
                'Vagina',
                'Endometrium',
                'Myometrium',
                'Vulva',
              ],
            },
          },
          {
            id: 'female-conversation',
            type: 'conversation',
            title: 'OB/GYN Visit Simulation',
            points: 20,
            data: {
              scenario: 'Interpret an OB/GYN consultation discussing menstrual irregularities and PCOS.',
              responseWindow: 8,
              turns: 8,
            },
          },
        ],
      },
      {
        id: 'obstetrics-neonatal',
        pathId: 'reproductive-systems',
        title: 'Obstetrics & Neonatal Care',
        description: 'Labor stages, pregnancy terminology, and neonatal care interpretation.',
        estimatedTime: 120,
        points: 140,
        orderIndex: 3,
        isLocked: false,
        activities: [
          {
            id: 'obstetrics-reading',
            type: 'reading',
            title: 'Obstetrics Overview',
            points: 15,
            data: {
              content: `# Obstetrics & Labor

## Stages of Labor

**Stage 1: Cervical Dilation**
- Early labor: 0-3 cm dilation
- Active labor: 4-7 cm dilation
- Transition: 8-10 cm dilation (fully dilated)
- Also involves cervical effacement (thinning)

**Stage 2: Delivery of Baby**
- From full dilation to birth
- Pushing stage
- Crowning - when baby's head becomes visible

**Stage 3: Delivery of Placenta**
- After baby is born
- Placenta detaches and is expelled
- Typically 5-30 minutes after birth

## Key Terms

**Gestation / Pregnancy**
- Measured in weeks from last menstrual period (LMP)
- Full term: 37-42 weeks
- Trimesters: 1st (0-13 weeks), 2nd (14-27 weeks), 3rd (28+ weeks)

**Prenatal Care**
- Regular checkups during pregnancy
- Ultrasounds to monitor fetal development
- Screening tests for genetic conditions

**Common Complications**
- Preeclampsia - high blood pressure during pregnancy
- Gestational diabetes
- Placenta previa - placenta covers cervix
- Preterm labor - labor before 37 weeks

## Neonatal Care

**Neonatal Period**
- First 28 days of life

**APGAR Score**
- Assessment at 1 and 5 minutes after birth
- Evaluates: Appearance, Pulse, Grimace, Activity, Respiration
- Score of 0-10

**Common Neonatal Conditions**
- Jaundice (hyperbilirubinemia)
- Respiratory distress
- Neonatal infections`,
              estimatedTime: 15,
            },
          },
          {
            id: 'obstetrics-terminology',
            type: 'terminology-drill',
            title: 'Obstetrics Terminology',
            points: 30,
            data: {
              specialty: 'obstetrics',
              terms: [
                {
                  english: 'Labor / Childbirth',
                  spanish: 'Parto / Trabajo de parto',
                  context: 'Process of delivering a baby',
                },
                {
                  english: 'Contraction',
                  spanish: 'Contracción',
                  context: 'Tightening of uterine muscles during labor',
                },
                {
                  english: 'Cervical dilation',
                  spanish: 'Dilatación cervical',
                  context: 'Opening of the cervix during labor (measured in cm)',
                },
                {
                  english: 'Epidural',
                  spanish: 'Epidural',
                  context: 'Anesthesia injected into space around spinal cord for pain relief',
                },
                {
                  english: 'Cesarean section (C-section)',
                  spanish: 'Cesárea',
                  context: 'Surgical delivery through incision in abdomen and uterus',
                },
                {
                  english: 'Prenatal',
                  spanish: 'Prenatal',
                  context: 'Before birth',
                },
                {
                  english: 'Postpartum',
                  spanish: 'Posparto',
                  context: 'After birth (referring to mother)',
                },
                {
                  english: 'Neonatal',
                  spanish: 'Neonatal',
                  context: 'First 28 days of life',
                },
                {
                  english: 'Miscarriage',
                  spanish: 'Aborto espontáneo',
                  context: 'Spontaneous loss of pregnancy before 20 weeks',
                },
                {
                  english: 'Preeclampsia',
                  spanish: 'Preeclampsia',
                  context: 'High blood pressure during pregnancy',
                },
              ],
            },
          },
          {
            id: 'obstetrics-quiz',
            type: 'quiz',
            title: 'Obstetrics Knowledge Check',
            points: 25,
            data: {
              questions: [
                {
                  question: 'What is cervical effacement?',
                  options: [
                    'Opening of the cervix',
                    'Thinning of the cervix',
                    'Inflammation of the cervix',
                    'Infection of the cervix',
                  ],
                  correctAnswer: 'Thinning of the cervix',
                  explanation:
                    'Effacement is the thinning and shortening of the cervix during labor. Dilation is the opening.',
                },
                {
                  question: 'What does "crowning" mean during labor?',
                  options: [
                    'Mother reaches full dilation',
                    'Baby\'s head becomes visible at vaginal opening',
                    'Placenta is delivered',
                    'Labor begins',
                  ],
                  correctAnswer: 'Baby\'s head becomes visible at vaginal opening',
                  explanation: 'Crowning occurs during Stage 2 when the baby\'s head appears at the vaginal opening.',
                },
              ],
            },
          },
          {
            id: 'labor-conversation',
            type: 'conversation',
            title: 'Labor & Delivery Simulation',
            points: 35,
            data: {
              scenario:
                'Interpret a labor and delivery scenario with a Spanish-speaking mother experiencing contractions and discussing pain management options with the obstetrician.',
              responseWindow: 8,
              turns: 12,
            },
          },
          {
            id: 'obstetrics-voice',
            type: 'voice-recording',
            title: 'Explaining Cesarean Section',
            points: 20,
            data: {
              prompt:
                'Practice explaining (in Spanish) what a Cesarean section is and why it might be necessary. Speak as if interpreting for a provider explaining this to a patient.',
              minDuration: 60,
            },
          },
        ],
      },
    ],
  },

  // Additional paths can be added for:
  // - Medical terminology (by system)
  // - Certification preparation (NBCMI/CCHI)
  // - Specialty areas (Mental health, pediatrics, etc.)
  // - Advanced interpretation techniques
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getLearningPath(pathId: string): LearningPath | undefined {
  return INTERPRETER_LEARNING_PATHS[pathId];
}

export function getAllLearningPaths(): LearningPath[] {
  return Object.values(INTERPRETER_LEARNING_PATHS);
}

export function getModule(pathId: string, moduleId: string): LearningModule | undefined {
  const path = INTERPRETER_LEARNING_PATHS[pathId];
  return path?.modules.find((m) => m.id === moduleId);
}

export function getNextModule(pathId: string, currentModuleId: string): LearningModule | undefined {
  const path = INTERPRETER_LEARNING_PATHS[pathId];
  if (!path) return undefined;
  const currentIndex = path.modules.findIndex((m) => m.id === currentModuleId);
  if (currentIndex === -1 || currentIndex >= path.modules.length - 1) return undefined;
  return path.modules[currentIndex + 1];
}

export function getTotalPathPoints(pathId: string): number {
  const path = INTERPRETER_LEARNING_PATHS[pathId];
  if (!path) return 0;
  return path.modules.reduce((sum, module) => sum + module.points, 0);
}

export function getPathProgress(pathId: string, completedActivities: string[]): number {
  const path = INTERPRETER_LEARNING_PATHS[pathId];
  if (!path) return 0;

  const totalActivities = path.modules.reduce((sum, module) => sum + module.activities.length, 0);
  const completedInPath = path.modules.reduce((sum, module) => {
    return (
      sum + module.activities.filter((activity) => completedActivities.includes(activity.id)).length
    );
  }, 0);

  return totalActivities > 0 ? (completedInPath / totalActivities) * 100 : 0;
}
