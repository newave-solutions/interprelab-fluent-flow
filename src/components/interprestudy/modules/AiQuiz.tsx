import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    HelpCircle, Loader2, CheckCircle, XCircle, Trophy,
    RefreshCw, Brain, Sparkles, ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const SPECIALTIES = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'pulmonology', label: 'Pulmonology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'obstetrics', label: 'Obstetrics & Gynecology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'endocrinology', label: 'Endocrinology' },
];

export function AiQuiz() {
    const [specialty, setSpecialty] = useState<string>('cardiology');
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [streak, setStreak] = useState(0);

    const generateQuestion = async () => {
        setIsLoading(true);
        setSelectedAnswer(null);
        setShowResult(false);

        try {
            const { data, error } = await supabase.functions.invoke('interactive-module-ai', {
                body: {
                    action: 'generate-quiz',
                    topic: specialty,
                    specialty: specialty
                }
            });

            if (error) throw error;

            if (data && data.question && data.options) {
                setCurrentQuestion(data);
            } else {
                throw new Error('Invalid quiz data');
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
            toast.error('Failed to generate question. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelect = (index: number) => {
        if (showResult || !currentQuestion) return;

        setSelectedAnswer(index);
        setShowResult(true);

        const isCorrect = index === currentQuestion.correctIndex;
        setScore(prev => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            total: prev.total + 1
        }));

        if (isCorrect) {
            setStreak(prev => prev + 1);
            toast.success(`Correct! 🎉 Streak: ${streak + 1}`);
        } else {
            setStreak(0);
            toast.error('Incorrect. Keep studying!');
        }
    };

    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">AI-Powered Quiz</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Test your medical terminology knowledge with AI-generated questions
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span className="font-bold">{score.correct}/{score.total}</span>
                        <span className="text-muted-foreground text-sm">({accuracy}%)</span>
                    </div>
                    {streak > 0 && (
                        <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                            🔥 {streak} streak
                        </Badge>
                    )}
                </div>
            </div>

            {/* Specialty Selector */}
            <Card className="bg-card/50">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Select Specialty</label>
                            <Select value={specialty} onValueChange={setSpecialty}>
                                <SelectTrigger className="w-full md:w-64">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border border-border z-50">
                                    {SPECIALTIES.map(s => (
                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={generateQuestion}
                            disabled={isLoading}
                            className="mt-4 md:mt-6"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : currentQuestion ? (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            {currentQuestion ? 'New Question' : 'Generate Question'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Question Card */}
            {isLoading ? (
                <Card className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Generating your question...</p>
                    </div>
                </Card>
            ) : currentQuestion ? (
                <Card className="overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-border">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <HelpCircle className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <Badge className="mb-2">{specialty.charAt(0).toUpperCase() + specialty.slice(1)}</Badge>
                                <CardTitle className="text-lg leading-relaxed">{currentQuestion.question}</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrect = index === currentQuestion.correctIndex;
                                const showCorrect = showResult && isCorrect;
                                const showIncorrect = showResult && isSelected && !isCorrect;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        disabled={showResult}
                                        className={cn(
                                            "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                                            "hover:border-primary/50 hover:bg-primary/5",
                                            isSelected && !showResult && "border-primary bg-primary/10",
                                            showCorrect && "border-green-500 bg-green-500/10",
                                            showIncorrect && "border-red-500 bg-red-500/10",
                                            !showResult && !isSelected && "border-border"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                                showCorrect && "bg-green-500 text-white",
                                                showIncorrect && "bg-red-500 text-white",
                                                !showResult && "bg-muted"
                                            )}>
                                                {showCorrect ? <CheckCircle className="w-5 h-5" /> :
                                                    showIncorrect ? <XCircle className="w-5 h-5" /> :
                                                        String.fromCharCode(65 + index)}
                                            </span>
                                            <span className={cn(
                                                "flex-1",
                                                showCorrect && "font-medium text-green-700 dark:text-green-300",
                                                showIncorrect && "font-medium text-red-700 dark:text-red-300"
                                            )}>
                                                {option}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        {showResult && (
                            <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border animate-fade-in">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Explanation
                                </h4>
                                <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                                <Button
                                    onClick={generateQuestion}
                                    className="mt-4"
                                    variant="outline"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    Next Question
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card className="min-h-[400px] flex items-center justify-center border-dashed">
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Brain className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Ready to Test Your Knowledge?</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Select a medical specialty above and click "Generate Question" to start your AI-powered quiz session.
                        </p>
                        <Button onClick={generateQuestion}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Start Quiz
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
