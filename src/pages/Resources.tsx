import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Resources = () => {
  const articles = [
    {
      title: "The Rise of AI in Interpretation",
      summary: "Artificial Intelligence is revolutionizing the language industry by enhancing speed and efficiency. Tools like Neural Machine Translation (NMT) are becoming essential, but human oversight remains critical to ensure cultural nuance and contextual accuracy.",
      href: "https://langpros.net/blog/the-latest-trends-in-the-translation-and-interpretation-industry/",
      image: "/placeholder.svg"
    },
    {
      title: "Hybrid and Remote Interpreting is the New Norm",
      summary: "The global shift to remote work has accelerated the adoption of Video Remote Interpreting (VRI) and Over-the-Phone Interpreting (OPI). These hybrid solutions combine the scalability of technology with the precision of human interpreters.",
      href: "https://www.ititranslates.com/blog/translation-and-interpretation-industry-trends/",
      image: "/placeholder.svg"
    },
    {
      title: "The Future is Specialized and Ethical",
      summary: "As AI tools become more common, there's a growing demand for hyper-localization and ethical AI practices. Future developments focus on adapting AI for specific domains like medical and legal fields, and even developing emotionally intelligent AI.",
      href: "https://interpretcloud.com/ai-in-language-interpretation-trends-and-future-developments/",
      image: "/placeholder.svg"
    }
  ];

  const externalResources = [
    { title: "National Board of Certification for Medical Interpreters (NBCMI)", href: "https://www.certifiedmedicalinterpreters.org/" },
    { title: "Certification Commission for Healthcare Interpreters (CCHI)", href: "https://cchicertification.org/" },
    { title: "American Translators Association (ATA)", href: "https://www.atanet.org/" },
    { title: "International Medical Interpreters Association (IMIA)", href: "https://www.imiaweb.org/" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Resources</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated library of industry insights, articles, and essential links for professional interpreters.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Industry Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.title} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover"/>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground mb-4 flex-grow">{article.summary}</p>
                  <Button asChild variant="outline" className="mt-auto">
                    <a href={article.href} target="_blank" rel="noopener noreferrer">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Professional Organizations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {externalResources.map((resource) => (
              <a href={resource.href} target="_blank" rel="noopener noreferrer" key={resource.title} className="block p-6 bg-card rounded-lg border hover:bg-muted hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold text-foreground">{resource.title}</h3>
                <p className="text-sm text-primary mt-2">Visit Site →</p>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;