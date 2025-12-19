import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, BookOpen, CheckCircle, Play, 
  Lock, ArrowRight, Clock, Star, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  progress: number;
  isLocked: boolean;
  category: 'ethics' | 'techniques' | 'specialization';
}

const MODULES: Module[] = [
  {
    id: 'dcs-schema',
    title: 'DCS Schema Training',
    description: 'Master the Dynamic Conceptual Schema for medical interpreting - the foundation of professional interpretation.',
    duration: '2 hours',
    lessons: 8,
    progress: 0,
    isLocked: false,
    category: 'techniques'
  },
  {
    id: 'ethics-101',
    title: 'Code of Ethics',
    description: 'Understand and apply the NCIHC Standards of Practice and Code of Ethics for medical interpreters.',
    duration: '1.5 hours',
    lessons: 6,
    progress: 0,
    isLocked: false,
    category: 'ethics'
  },
  {
    id: 'vicarious-trauma',
    title: 'Vicarious Trauma Management',
    description: 'Learn strategies to recognize, prevent, and manage vicarious trauma in medical interpreting.',
    duration: '1 hour',
    lessons: 4,
    progress: 0,
    isLocked: false,
    category: 'ethics'
  },
  {
    id: 'sight-translation',
    title: 'Sight Translation',
    description: 'Develop skills for accurate sight translation of medical documents and consent forms.',
    duration: '2 hours',
    lessons: 7,
    progress: 0,
    isLocked: true,
    category: 'techniques'
  },
  {
    id: 'mental-health',
    title: 'Mental Health Interpreting',
    description: 'Specialized training for interpreting in mental health and psychiatric settings.',
    duration: '2.5 hours',
    lessons: 10,
    progress: 0,
    isLocked: true,
    category: 'specialization'
  },
  {
    id: 'legal-medical',
    title: 'Legal-Medical Interpreting',
    description: 'Navigate the intersection of legal and medical terminology in healthcare settings.',
    duration: '2 hours',
    lessons: 8,
    progress: 0,
    isLocked: true,
    category: 'specialization'
  }
];

const LESSON_CONTENT = {
  'dcs-schema': [
    { title: 'Introduction to DCS', type: 'video', completed: false },
    { title: 'Understanding Message Analysis', type: 'reading', completed: false },
    { title: 'Reformulation Strategies', type: 'video', completed: false },
    { title: 'Practice: Simple Sentences', type: 'exercise', completed: false },
    { title: 'Cultural Mediation in DCS', type: 'video', completed: false },
    { title: 'Practice: Complex Medical Scenarios', type: 'exercise', completed: false },
    { title: 'Memory Techniques', type: 'reading', completed: false },
    { title: 'Final Assessment', type: 'quiz', completed: false },
  ],
  'ethics-101': [
    { title: 'NCIHC Standards Overview', type: 'video', completed: false },
    { title: 'Confidentiality & HIPAA', type: 'reading', completed: false },
    { title: 'Role Boundaries', type: 'video', completed: false },
    { title: 'Advocacy in Medical Settings', type: 'reading', completed: false },
    { title: 'Case Studies', type: 'exercise', completed: false },
    { title: 'Ethics Assessment', type: 'quiz', completed: false },
  ],
  'vicarious-trauma': [
    { title: 'Recognizing Signs of VT', type: 'video', completed: false },
    { title: 'Prevention Strategies', type: 'reading', completed: false },
    { title: 'Self-Care Toolkit', type: 'exercise', completed: false },
    { title: 'Building Resilience', type: 'video', completed: false },
  ]
};

export function CoreDynamicsTraining() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'ethics' | 'techniques' | 'specialization'>('all');

  const filteredModules = MODULES.filter(m => 
    activeCategory === 'all' || m.category === activeCategory
  );

  const module = selectedModule ? MODULES.find(m => m.id === selectedModule) : null;
  const lessons = selectedModule ? LESSON_CONTENT[selectedModule as keyof typeof LESSON_CONTENT] || [] : [];

  if (selectedModule && module) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedModule(null)}>
            ← Back to Modules
          </Button>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {module.duration}
          </Badge>
        </div>

        {/* Module Header */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                <p className="text-muted-foreground mb-4">{module.description}</p>
                <div className="flex items-center gap-4">
                  <Progress value={module.progress} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{module.progress}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
            <CardDescription>{lessons.length} lessons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all",
                  "hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
                  lesson.completed && "bg-green-500/5 border-green-500/20"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                  lesson.completed ? "bg-green-500 text-white" : "bg-muted"
                )}>
                  {lesson.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{lesson.title}</h4>
                  <span className="text-xs text-muted-foreground capitalize">{lesson.type}</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {lesson.type === 'video' && <Play className="w-3 h-3 mr-1" />}
                  {lesson.type === 'reading' && <BookOpen className="w-3 h-3 mr-1" />}
                  {lesson.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button size="lg" className="px-8">
            <Play className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Core Dynamics Training</h2>
          </div>
          <p className="text-muted-foreground">
            Master the fundamental skills of professional medical interpretation
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 rounded-lg border border-warning/20">
          <Award className="w-5 h-5 text-warning" />
          <span className="font-medium">0 Certificates Earned</span>
        </div>
      </div>

      {/* Category Filter */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as typeof activeCategory)}>
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="ethics">Ethics</TabsTrigger>
          <TabsTrigger value="techniques">Techniques</TabsTrigger>
          <TabsTrigger value="specialization">Specialization</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <Card 
            key={module.id}
            className={cn(
              "transition-all duration-300 cursor-pointer",
              module.isLocked ? "opacity-60" : "hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
            )}
            onClick={() => !module.isLocked && setSelectedModule(module.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className={cn(
                  "p-2 rounded-lg",
                  module.isLocked ? "bg-muted" : "bg-primary/10"
                )}>
                  {module.isLocked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-primary" />
                  )}
                </div>
                <Badge variant="outline" className="capitalize text-xs">
                  {module.category}
                </Badge>
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription className="line-clamp-2">{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </span>
                <span>{module.lessons} lessons</span>
              </div>
              <Progress value={module.progress} className="h-2 mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{module.progress}% complete</span>
                {!module.isLocked && (
                  <Button variant="ghost" size="sm" className="text-primary">
                    {module.progress > 0 ? 'Continue' : 'Start'} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
