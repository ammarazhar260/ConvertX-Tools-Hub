import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import PDFToWordConverter from "@/components/tools/PDFToWordConverter";
import WordToPDFConverter from "@/components/tools/WordToPDFConverter";
import AIImageGenerator from "@/components/tools/AIImageGenerator";
import { useTools } from "@/context/ToolsContext";
import DynamicToolRenderer from "@/components/tools/DynamicToolRenderer";
import UnitConverter from "@/components/tools/UnitConverter";
import CodeFormatter from "@/components/tools/CodeFormatter";
import MarkdownConverter from "@/components/tools/MarkdownConverter";
import TextToVoiceConverter from "@/components/tools/TextToVoiceConverter";

const ToolPage = () => {
  const { toolId } = useParams();
  const { tools } = useTools();

  const tool = tools.find(t => t.id === toolId);

  if (!tool) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">Tool not found</h2>
          <p className="mt-4 text-muted-foreground">
            The tool you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </MainLayout>
    );
  }

  // Function to render the appropriate tool interface based on toolId
  const renderToolInterface = () => {
    // Special case for tools with dedicated components
    if (toolId === "pdf-to-word") {
      return <PDFToWordConverter />;
    }
    if (toolId === "word-to-pdf") {
      return <WordToPDFConverter />;
    }
    if (toolId === "ai-image-generator") {
      return <AIImageGenerator />;
    }
    if (toolId === "unit-converter") {
      return <UnitConverter />;
    }
    if (toolId === "code-formatter") {
      return <CodeFormatter />;
    }
    if (toolId === "markdown-converter") {
      return <MarkdownConverter />;
    }
    if (toolId === "text-to-voice-converter") {
      return <TextToVoiceConverter />;
    }
    
    // If the tool has an implementation, use the dynamic renderer
    if (tool.implementation) {
      return <DynamicToolRenderer toolId={tool.id} implementation={tool.implementation} />;
    }
    
    // Generic placeholder for tools that don't have a specific implementation yet
    return (
      <Card>
        <CardContent className="p-6 text-center py-12">
          <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            The {tool.title} tool is currently in development.
          </p>
        </CardContent>
      </Card>
    );
  };

  // Function to get specific "How It Works" instructions based on the tool
  const getHowItWorks = () => {
    switch (toolId) {
      case "pdf-to-word":
        return (
          <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
            <li>Upload your PDF file by dragging and dropping or clicking the upload area</li>
            <li>Click "Convert to Word" to process your document</li>
            <li>Wait for the conversion to complete</li>
            <li>Download your converted Word document when processing is complete</li>
            <li>Your document is now ready to edit in Microsoft Word or any compatible application</li>
          </ol>
        );
      case "word-to-pdf":
        return (
          <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
            <li>Upload your Word document by dragging and dropping or clicking the upload area</li>
            <li>Click "Convert to PDF" to process your document</li>
            <li>Wait for the conversion to complete</li>
            <li>Download your converted PDF document when processing is complete</li>
            <li>Your document is now ready to view in any PDF reader</li>
          </ol>
        );
      case "ai-image-generator":
        return (
          <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
            <li>Enter a detailed text description of the image you want to generate</li>
            <li>Select your preferred model and image size options</li>
            <li>Click "Generate Image" to create your AI image</li>
            <li>For more control, use the Advanced tab to set parameters like steps and guidance scale</li>
            <li>Download your generated image when processing completes</li>
          </ol>
        );
      default:
        return (
          <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
            <li>Upload your file or enter text to convert</li>
            <li>Configure any optional settings</li>
            <li>Click "Convert Now" to process</li>
            <li>Download or copy your converted result</li>
          </ol>
        );
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {tool.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{tool.title}</h1>
            <p className="text-muted-foreground">{tool.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Tool Interface - Takes 3/5 of the width on large screens */}
          <div className="lg:col-span-3">
            {renderToolInterface()}
          </div>

          {/* Sidebar - Takes 2/5 of the width on large screens */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">How It Works</h3>
                {getHowItWorks()}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Related Tools</h3>
                <ul className="space-y-3">
                  {tools
                    .filter(t => t.category === tool.category && t.id !== tool.id)
                    .slice(0, 3)
                    .map(relatedTool => (
                      <li key={relatedTool.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          {relatedTool.icon}
                        </div>
                        <a 
                          href={`/tools/${relatedTool.id}`}
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          {relatedTool.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ToolPage;
