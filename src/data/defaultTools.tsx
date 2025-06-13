import React from "react";
import { Wand2, VolumeIcon, FileText, ImageIcon, FileCode, Calculator, Zap, ClipboardCopy, File } from "lucide-react";
import { Tool } from "@/types/tool";

export const defaultTools: Tool[] = [
  {
    id: "ai-image-generator",
    title: "AI Image Generator",
    description: "Create stunning images from text descriptions using advanced AI models.",
    icon: <Wand2 className="h-5 w-5" />,
    category: "AI",
    status: "active",
    implementation: `
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AIImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [model, setModel] = useState("stable-diffusion-v1-5");
  const [size, setSize] = useState("512x512");
  const [steps, setSteps] = useState(30);
  const [guidance, setGuidance] = useState(7.5);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Mock API call for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, use a placeholder image from Unsplash based on the prompt
      const placeholderImage = "https://source.unsplash.com/random/512x512/?"+encodeURIComponent(prompt);
      setGeneratedImage(placeholderImage);
      
      // Log the generation in localStorage for user history
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        const historyKey = \`toolHistory_\${userEmail}\`;
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
        
        const newEntry = {
          toolId: "ai-image-generator",
          toolName: "AI Image Generator",
          prompt: prompt,
          date: new Date().toISOString(),
        };
        
        localStorage.setItem(historyKey, JSON.stringify([newEntry, ...existingHistory]));
      }
      
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = \`ai-generated-\${Date.now()}.jpg\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download started");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="generate">
          <TabsList className="mb-6">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="advanced" disabled={isGenerating}>Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Textarea
                  placeholder="Describe the image you want to generate..."
                  className="min-h-[100px] resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Be specific with details like style, lighting, composition, etc.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="text-sm font-medium block mb-2">Model</label>
                  <Select 
                    value={model} 
                    onValueChange={setModel}
                    disabled={isGenerating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable-diffusion-v1-5">Stable Diffusion v1.5</SelectItem>
                      <SelectItem value="stable-diffusion-xl">Stable Diffusion XL</SelectItem>
                      <SelectItem value="dall-e-mini">DALL-E Mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-1/2">
                  <label className="text-sm font-medium block mb-2">Image Size</label>
                  <Select 
                    value={size} 
                    onValueChange={setSize}
                    disabled={isGenerating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512x512">512 × 512</SelectItem>
                      <SelectItem value="768x768">768 × 768</SelectItem>
                      <SelectItem value="1024x1024">1024 × 1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
              
              {generatedImage && !isGenerating && (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                    <img
                      src={generatedImage}
                      alt="Generated image"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="secondary"
                      onClick={() => handleGenerate()}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center text-xs text-muted-foreground mt-8">
              <p>AI Image Generator powered by Stable Diffusion</p>
              <p>Images are generated based on your text prompt</p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Negative Prompt</label>
                <Textarea
                  placeholder="Elements you want to exclude from the image..."
                  className="min-h-[100px] resize-none"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Specify what you don't want to see in the generated image
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Steps: {steps}</label>
                  </div>
                  <Slider
                    value={[steps]}
                    min={10}
                    max={50}
                    step={1}
                    onValueChange={(value) => setSteps(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values produce more detailed images but take longer (10-50)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Guidance Scale: {guidance}</label>
                  </div>
                  <Slider
                    value={[guidance]}
                    min={1}
                    max={20}
                    step={0.5}
                    onValueChange={(value) => setGuidance(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    How closely to follow your prompt (1-20)
                  </p>
                </div>
              </div>
              
              <Alert className="bg-muted/50">
                <AlertTitle>Advanced Settings</AlertTitle>
                <AlertDescription>
                  These settings allow fine control over the image generation process. Higher values for steps and guidance generally improve quality but increase generation time.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIImageGenerator;
    `
  },
  {
    id: "text-to-voice-converter",
    title: "AI Text to Speech",
    description: "Convert text to natural-sounding speech with multiple voice options.",
    icon: <VolumeIcon className="h-5 w-5" />,
    category: "AI",
    status: "active",
    implementation: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Text to Speech</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        textarea {
            width: 100%;
            height: 150px;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-bottom: 10px;
            font-size: 16px;
        }
        button, select, input[type="range"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 16px;
            cursor: pointer;
        }
        button:hover, select:hover, input[type="range"]:hover {
            background-color: #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI Text to Speech</h1>
        <textarea id="text-input" placeholder="Type your text here..."></textarea>
        <button id="speak-btn">Speak</button>
        <button id="pause-btn">Pause</button>
        <button id="resume-btn">Resume</button>
        <label for="rate">Rate</label>
        <input type="range" id="rate" min="0.5" max="2" value="1" step="0.1">
        <label for="pitch">Pitch</label>
        <input type="range" id="pitch" min="0" max="2" value="1" step="0.1">
        <label for="voice">Voice</label>
        <select id="voice"></select>
    </div>

    <script>
        const synth = window.speechSynthesis;
        const textInput = document.getElementById('text-input');
        const speakBtn = document.getElementById('speak-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resumeBtn = document.getElementById('resume-btn');
        const rate = document.getElementById('rate');
        const pitch = document.getElementById('pitch');
        const voiceSelect = document.getElementById('voice');

        let voices = [];

        const loadVoices = () => {
            voices = synth.getVoices();
            voiceSelect.innerHTML = '';
            voices.forEach((voice, i) => {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = \`\${voice.name} (\${voice.lang})\`;
                voiceSelect.appendChild(option);
            });
        };

        loadVoices();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }

        const speak = () => {
            if (synth.speaking) {
                console.error('Already speaking...');
                return;
            }
            if (textInput.value !== '') {
                const utterThis = new SpeechSynthesisUtterance(textInput.value);
                utterThis.onend = () => {
                    console.log('SpeechSynthesisUtterance.onend');
                };
                utterThis.onerror = (event) => {
                    console.error('SpeechSynthesisUtterance.onerror', event);
                };
                const selectedVoice = voices[voiceSelect.value];
                utterThis.voice = selectedVoice;
                utterThis.pitch = pitch.value;
                utterThis.rate = rate.value;
                synth.speak(utterThis);
            }
        };

        speakBtn.addEventListener('click', speak);

        pauseBtn.addEventListener('click', () => {
            if (synth.speaking) synth.pause();
        });

        resumeBtn.addEventListener('click', () => {
            if (synth.paused) synth.resume();
        });
    </script>
</body>
</html>
    `
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert PDF documents to editable Word files with formatting preserved.",
    icon: <FileText className="h-5 w-5" />,
    category: "Converter",
    status: "active"
  },
  {
    id: "word-to-pdf",
    title: "Word to PDF",
    description: "Convert Word documents to PDF format with perfect formatting.",
    icon: <File className="h-5 w-5" />,
    category: "Converter",
    status: "active"
  },
  {
    id: "code-formatter",
    title: "Code Formatter",
    description: "Format and beautify code in multiple programming languages.",
    icon: <FileCode className="h-5 w-5" />,
    category: "Utility",
    status: "active",
    implementation: `
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const CodeFormatter = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [formattedCode, setFormattedCode] = useState('');

  const formatCode = () => {
    try {
      let formatted = code;
      
      // For demonstration, we're just adding indentation
      // In a real implementation, you would use a library like prettier
      const lines = code.split('\\n');
      let indentLevel = 0;
      
      formatted = lines.map(line => {
        const trimmed = line.trim();
        
        // Decrease indent for closing brackets/braces
        if (trimmed.startsWith('}') || trimmed.startsWith(')') || trimmed.startsWith(']')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const indented = '  '.repeat(indentLevel) + trimmed;
        
        // Increase indent for opening brackets/braces
        if (trimmed.endsWith('{') || trimmed.endsWith('(') || trimmed.endsWith('[')) {
          indentLevel += 1;
        }
        
        return indented;
      }).join('\\n');
      
      setFormattedCode(formatted);
      toast.success('Code formatted successfully');
    } catch (error) {
      console.error('Error formatting code:', error);
      toast.error('Failed to format code');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedCode);
    toast.success('Code copied to clipboard');
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={formatCode}>Format Code</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Input Code</h3>
            <Textarea 
              className="min-h-[300px] font-mono text-sm"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Formatted Output</h3>
              {formattedCode && (
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  Copy
                </Button>
              )}
            </div>
            <Textarea 
              className="min-h-[300px] font-mono text-sm"
              value={formattedCode}
              readOnly
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeFormatter;
      `
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert between different units of measurement with precision.",
    icon: <Calculator className="h-5 w-5" />,
    category: "Utility",
    status: "active"
  },
  {
    id: "markdown-converter",
    title: "Markdown Converter",
    description: "Convert Markdown to HTML or other formats with live preview.",
    icon: <ClipboardCopy className="h-5 w-5" />,
    category: "Converter",
    status: "active"
  }
];
