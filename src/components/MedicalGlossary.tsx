import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Search, Volume2, BookOpen } from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  phonetic?: string;
}

// Sample medical terminology from InterpreStudy platform
const medicalTerms: GlossaryTerm[] = [
  {
    term: "Hypertension",
    definition: "High blood pressure; a condition where the force of blood against artery walls is consistently too high, requiring medical management.",
    category: "Cardiovascular",
    phonetic: "hahy-per-ten-shuhn",
  },
  {
    term: "Anticoagulant",
    definition: "A medication that prevents blood clot formation; commonly called blood thinners. Examples include warfarin and heparin.",
    category: "Medication",
    phonetic: "an-tee-koh-ag-yuh-luhnt",
  },
  {
    term: "Diabetes Mellitus",
    definition: "A metabolic disorder characterized by high blood sugar levels due to insufficient insulin production or insulin resistance.",
    category: "Endocrine",
    phonetic: "dahy-uh-bee-teez mel-i-tuhs",
  },
  {
    term: "Myocardial Infarction",
    definition: "Heart attack; occurs when blood flow to part of the heart muscle is blocked, causing tissue damage or death.",
    category: "Cardiovascular",
    phonetic: "mahy-uh-kahr-dee-uhl in-fahrk-shuhn",
  },
  {
    term: "Chronic Obstructive Pulmonary Disease",
    definition: "COPD; a progressive lung disease that makes breathing difficult, often caused by smoking or long-term exposure to irritants.",
    category: "Respiratory",
    phonetic: "kron-ik uhb-struhk-tiv puhl-muh-ner-ee dih-zeez",
  },
  {
    term: "Anesthesia",
    definition: "Loss of sensation or consciousness induced by medication to prevent pain during medical procedures.",
    category: "Medical Procedure",
    phonetic: "an-uhs-thee-zhuh",
  },
  {
    term: "Biopsy",
    definition: "A medical procedure involving the removal of tissue or cells for examination to diagnose disease.",
    category: "Medical Procedure",
    phonetic: "bahy-op-see",
  },
  {
    term: "Chemotherapy",
    definition: "Treatment using chemical substances to destroy cancer cells or inhibit their growth.",
    category: "Oncology",
    phonetic: "kee-moh-ther-uh-pee",
  }
];

export const MedicalGlossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(medicalTerms.map(term => term.category)))];

  const filteredTerms = medicalTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const playPronunciation = (phonetic: string) => {
    // In a real implementation, this would use text-to-speech
    console.log(`Playing pronunciation: ${phonetic}`);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <BookOpen className="w-4 h-4 mr-2" />
            Medical Terminology
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Interactive Medical Glossary
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Essential medical terms with pronunciations and definitions for professional interpreters
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search medical terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </div>

        {/* Terms Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTerms.map((term, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{term.term}</CardTitle>
                      {term.phonetic && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground italic">
                            /{term.phonetic}/
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => playPronunciation(term.phonetic!)}
                            className="h-6 w-6 p-0"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {term.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {term.definition}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No terms found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </Card>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Card className="p-8 bg-gradient-to-r from-green-600/10 to-blue-600/10 border-primary/30 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Access Full Terminology Database</h3>
            <p className="text-muted-foreground mb-6">
              Get access to thousands of medical terms with AI-powered translations,
              personal glossary management, and pronunciation guides.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Launch InterpreStudy Platform
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};
