import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Minimize2, 
  Maximize2,
  Languages,
  Brain,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Stethoscope
} from "lucide-react";

interface ContextWindow {
  id: string;
  title: string;
  content: string;
  type: 'translation' | 'analysis' | 'cultural' | 'medical';
  confidence: number;
  timestamp: string;
}

export const ExtensionUI = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [contextWindows, setContextWindows] = useState<ContextWindow[]>([
    {
      id: '1',
      title: 'Live Translation',
      content: 'The patient reports chest pain that started this morning...',
      type: 'translation',
      confidence: 0.94,
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: '2', 
      title: 'Medical Context',
      content: 'Chest pain symptoms require immediate assessment for cardiac events...',
      type: 'medical',
      confidence: 0.91,
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: '3',
      title: 'Cultural Note',
      content: 'In this culture, patients may understate pain levels...',
      type: 'cultural',
      confidence: 0.87,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isRecording && Math.random() > 0.7) {
        const updates = [
          'Heart rate appears elevated, recommend ECG...',
          'Patient mentions family history of cardiac issues...',
          'Cultural consideration: Direct questioning preferred...',
          'Medical term "angina" may need explanation...'
        ];
        
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        setContextWindows(prev => {
          const newWindow: ContextWindow = {
            id: Date.now().toString(),
            title: 'Real-time Update',
            content: randomUpdate,
            type: Math.random() > 0.5 ? 'medical' : 'cultural',
            confidence: 0.8 + Math.random() * 0.2,
            timestamp: new Date().toLocaleTimeString()
          };
          return [newWindow, ...prev.slice(0, 2)];
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'translation': return <Languages className="w-4 h-4" />;
      case 'medical': return <Stethoscope className="w-4 h-4" />;
      case 'cultural': return <User className="w-4 h-4" />;
      case 'analysis': return <Brain className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'translation': return 'text-primary';
      case 'medical': return 'text-success';
      case 'cultural': return 'text-warning';
      case 'analysis': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="glass" 
          size="icon"
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full glow animate-pulse-glow"
        >
          <Languages className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-[80vh] z-50 extension-window">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <CardTitle className="text-lg">InterpreCoach</CardTitle>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant={isRecording ? "destructive" : "success"}
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              className="flex items-center gap-2"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? "Stop" : "Start"}
            </Button>
            
            <Badge variant="outline" className="text-xs">
              EN → ES
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="w-3 h-3" />
            <span>{isRecording ? "Active" : "Standby"}</span>
          </div>
        </div>
      </CardHeader>

      {/* Context Windows */}
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {contextWindows.map((window) => (
          <Card key={window.id} className="bg-muted/30 border-border/50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={getTypeColor(window.type)}>
                    {getTypeIcon(window.type)}
                  </span>
                  <span className="text-sm font-medium">{window.title}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span>{Math.round(window.confidence * 100)}%</span>
                  </div>
                  <Clock className="w-3 h-3" />
                  <span>{window.timestamp}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {window.content}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Status Indicator */}
        {isRecording && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Listening and processing...</span>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
};