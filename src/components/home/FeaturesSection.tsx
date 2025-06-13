import React from "react";
import { Wand2, VolumeIcon, FileText, FileCode } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => {
  const tools = [
    {
      id: "ai-image-generator",
      icon: <Wand2 className="w-6 h-6" />,
      title: "AI Image Generator",
      description: "Create stunning images from text descriptions using advanced AI models."
    },
    {
      id: "text-to-voice-converter",
      icon: <VolumeIcon className="w-6 h-6" />,
      title: "AI Text to Speech",
      description: "Convert text to natural-sounding speech with multiple voice options."
    },
    {
      id: "pdf-to-word",
      icon: <FileText className="w-6 h-6" />,
      title: "PDF to Word",
      description: "Convert PDF documents to editable Word files with formatting preserved."
    },
    {
      id: "code-formatter",
      icon: <FileCode className="w-6 h-6" />,
      title: "Code Formatter",
      description: "Format and beautify code in multiple programming languages."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Featured Tools</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular tools for content transformation and creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool) => (
            <Card key={tool.id} className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {tool.icon}
                </div>
                <CardTitle>{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{tool.description}</p>
                <Link to={`/tools/${tool.id}`}>
                  <Button variant="outline" className="w-full">
                    Try Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
