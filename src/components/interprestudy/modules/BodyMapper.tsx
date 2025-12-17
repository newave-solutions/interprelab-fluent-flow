import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Accessibility, Search, Volume2, BookOpen, Sparkles,
  Heart, Brain, Bone, Eye, Ear
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BodySystem {
  id: string;
  name: string;
  nameEs: string;
  icon: React.ReactNode;
  organs: Organ[];
}

interface Organ {
  id: string;
  name: string;
  nameEs: string;
  pronunciation: string;
  description: string;
  descriptionEs: string;
  conditions: string[];
  conditionsEs: string[];
}

const BODY_SYSTEMS: BodySystem[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    nameEs: 'Cardiovascular',
    icon: <Heart className="w-5 h-5" />,
    organs: [
      {
        id: 'heart',
        name: 'Heart',
        nameEs: 'Corazón',
        pronunciation: 'koh-rah-SOHN',
        description: 'A muscular organ that pumps blood throughout the body via the circulatory system.',
        descriptionEs: 'Órgano muscular que bombea sangre a todo el cuerpo a través del sistema circulatorio.',
        conditions: ['Myocardial infarction', 'Arrhythmia', 'Heart failure', 'Cardiomyopathy'],
        conditionsEs: ['Infarto de miocardio', 'Arritmia', 'Insuficiencia cardíaca', 'Cardiomiopatía']
      },
      {
        id: 'arteries',
        name: 'Arteries',
        nameEs: 'Arterias',
        pronunciation: 'ar-TEH-ree-ahs',
        description: 'Blood vessels that carry oxygen-rich blood away from the heart to the body.',
        descriptionEs: 'Vasos sanguíneos que transportan sangre rica en oxígeno desde el corazón hacia el cuerpo.',
        conditions: ['Atherosclerosis', 'Aneurysm', 'Arteritis'],
        conditionsEs: ['Aterosclerosis', 'Aneurisma', 'Arteritis']
      },
      {
        id: 'veins',
        name: 'Veins',
        nameEs: 'Venas',
        pronunciation: 'VEH-nahs',
        description: 'Blood vessels that carry blood back to the heart.',
        descriptionEs: 'Vasos sanguíneos que llevan la sangre de vuelta al corazón.',
        conditions: ['Deep vein thrombosis', 'Varicose veins', 'Phlebitis'],
        conditionsEs: ['Trombosis venosa profunda', 'Venas varicosas', 'Flebitis']
      }
    ]
  },
  {
    id: 'nervous',
    name: 'Nervous System',
    nameEs: 'Sistema Nervioso',
    icon: <Brain className="w-5 h-5" />,
    organs: [
      {
        id: 'brain',
        name: 'Brain',
        nameEs: 'Cerebro',
        pronunciation: 'seh-REH-broh',
        description: 'The central organ of the nervous system, controlling most body functions.',
        descriptionEs: 'Órgano central del sistema nervioso que controla la mayoría de las funciones corporales.',
        conditions: ['Stroke', 'Epilepsy', 'Meningitis', 'Encephalitis'],
        conditionsEs: ['Derrame cerebral', 'Epilepsia', 'Meningitis', 'Encefalitis']
      },
      {
        id: 'spinal-cord',
        name: 'Spinal Cord',
        nameEs: 'Médula Espinal',
        pronunciation: 'MEH-doo-lah es-pee-NAHL',
        description: 'A long, thin bundle of nervous tissue extending from the brain through the spine.',
        descriptionEs: 'Tejido nervioso largo y delgado que se extiende desde el cerebro a través de la columna.',
        conditions: ['Spinal cord injury', 'Myelitis', 'Spinal stenosis'],
        conditionsEs: ['Lesión de médula espinal', 'Mielitis', 'Estenosis espinal']
      }
    ]
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal',
    nameEs: 'Musculoesquelético',
    icon: <Bone className="w-5 h-5" />,
    organs: [
      {
        id: 'bones',
        name: 'Bones',
        nameEs: 'Huesos',
        pronunciation: 'WEH-sohs',
        description: 'Rigid organs that form the skeletal system, providing structure and protection.',
        descriptionEs: 'Órganos rígidos que forman el sistema esquelético, proporcionando estructura y protección.',
        conditions: ['Fracture', 'Osteoporosis', 'Osteomyelitis'],
        conditionsEs: ['Fractura', 'Osteoporosis', 'Osteomielitis']
      },
      {
        id: 'joints',
        name: 'Joints',
        nameEs: 'Articulaciones',
        pronunciation: 'ar-tee-koo-lah-SYOH-nehs',
        description: 'Points where two bones meet, allowing movement.',
        descriptionEs: 'Puntos donde dos huesos se encuentran, permitiendo el movimiento.',
        conditions: ['Arthritis', 'Bursitis', 'Dislocation'],
        conditionsEs: ['Artritis', 'Bursitis', 'Dislocación']
      }
    ]
  },
  {
    id: 'sensory',
    name: 'Sensory Organs',
    nameEs: 'Órganos Sensoriales',
    icon: <Eye className="w-5 h-5" />,
    organs: [
      {
        id: 'eyes',
        name: 'Eyes',
        nameEs: 'Ojos',
        pronunciation: 'OH-hohs',
        description: 'Organs of vision that detect light and convert it to electrical signals.',
        descriptionEs: 'Órganos de la visión que detectan la luz y la convierten en señales eléctricas.',
        conditions: ['Glaucoma', 'Cataracts', 'Macular degeneration', 'Conjunctivitis'],
        conditionsEs: ['Glaucoma', 'Cataratas', 'Degeneración macular', 'Conjuntivitis']
      },
      {
        id: 'ears',
        name: 'Ears',
        nameEs: 'Oídos',
        pronunciation: 'oh-EE-dohs',
        description: 'Organs of hearing and balance.',
        descriptionEs: 'Órganos de la audición y el equilibrio.',
        conditions: ['Otitis', 'Hearing loss', 'Tinnitus', 'Vertigo'],
        conditionsEs: ['Otitis', 'Pérdida auditiva', 'Tinnitus', 'Vértigo']
      }
    ]
  }
];

export function BodyMapper() {
  const [selectedSystem, setSelectedSystem] = useState<string>('cardiovascular');
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const currentSystem = BODY_SYSTEMS.find(s => s.id === selectedSystem);

  const filteredOrgans = currentSystem?.organs.filter(organ => {
    const query = searchQuery.toLowerCase();
    return organ.name.toLowerCase().includes(query) ||
      organ.nameEs.toLowerCase().includes(query) ||
      organ.conditions.some(c => c.toLowerCase().includes(query)) ||
      organ.conditionsEs.some(c => c.toLowerCase().includes(query));
  });

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'es' ? 'es-MX' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Accessibility className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Body Mapper</h2>
          </div>
          <p className="text-muted-foreground">
            Interactive anatomy learning tool with bilingual terminology
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('en')}
          >
            English
          </Button>
          <Button
            variant={language === 'es' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('es')}
          >
            Español
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search organs, conditions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Body Systems Tabs */}
      <Tabs value={selectedSystem} onValueChange={setSelectedSystem}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          {BODY_SYSTEMS.map(system => (
            <TabsTrigger
              key={system.id}
              value={system.id}
              className="flex items-center gap-2 py-3"
            >
              {system.icon}
              <span className="hidden md:inline">{language === 'en' ? system.name : system.nameEs}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {BODY_SYSTEMS.map(system => (
          <TabsContent key={system.id} value={system.id} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Organs List */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="font-semibold text-lg mb-4">
                  {language === 'en' ? system.name : system.nameEs}
                </h3>
                {filteredOrgans?.map(organ => (
                  <Card
                    key={organ.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      selectedOrgan?.id === organ.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => setSelectedOrgan(organ)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {language === 'en' ? organ.name : organ.nameEs}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === 'en' ? organ.nameEs : organ.name}
                          </p>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Listen to ${language === 'en' ? organ.name : organ.nameEs} pronunciation`}
                              onClick={(e) => {
                                e.stopPropagation();
                                speakText(language === 'en' ? organ.nameEs : organ.name, language === 'en' ? 'es' : 'en');
                              }}
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Listen to pronunciation</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Organ Details */}
              <div className="lg:col-span-2">
                {selectedOrgan ? (
                  <Card className="h-full">
                    <CardHeader className="bg-primary/5 border-b">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="mb-2">{language === 'en' ? currentSystem?.name : currentSystem?.nameEs}</Badge>
                          <CardTitle className="text-2xl">
                            {language === 'en' ? selectedOrgan.name : selectedOrgan.nameEs}
                          </CardTitle>
                          <CardDescription className="text-lg mt-1">
                            {language === 'en' ? selectedOrgan.nameEs : selectedOrgan.name}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => speakText(selectedOrgan.name, 'en')}
                          >
                            <Volume2 className="w-4 h-4 mr-1" /> EN
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => speakText(selectedOrgan.nameEs, 'es')}
                          >
                            <Volume2 className="w-4 h-4 mr-1" /> ES
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Pronunciation */}
                      <div className="p-4 bg-muted/50 rounded-xl">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Spanish Pronunciation
                        </h4>
                        <p className="text-xl font-mono">{selectedOrgan.pronunciation}</p>
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          Description
                        </h4>
                        <p className="text-muted-foreground">
                          {language === 'en' ? selectedOrgan.description : selectedOrgan.descriptionEs}
                        </p>
                      </div>

                      {/* Related Conditions */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Related Conditions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(language === 'en' ? selectedOrgan.conditions : selectedOrgan.conditionsEs).map((condition, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                            >
                              <div>
                                <span className="font-medium">{condition}</span>
                                <p className="text-xs text-muted-foreground">
                                  {language === 'en' ? selectedOrgan.conditionsEs[i] : selectedOrgan.conditions[i]}
                                </p>
                              </div>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label={`Listen to ${condition} pronunciation`}
                                    onClick={() => speakText(
                                      language === 'en' ? selectedOrgan.conditionsEs[i] : condition,
                                      language === 'en' ? 'es' : 'en'
                                    )}
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Listen to pronunciation</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
                    <div className="text-center p-8">
                      <Accessibility className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select an Organ</h3>
                      <p className="text-muted-foreground">
                        Click on an organ from the list to view detailed terminology information
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
