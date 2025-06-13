import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, Image as ImageIcon, Loader2, Plus, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Sample custom prompts for inspiration
const SAMPLE_PROMPTS = [
  "A serene lake surrounded by mountains at sunset, photorealistic",
  "Futuristic cityscape with flying cars and neon lights, digital art",
  "Portrait of a fantasy character with intricate armor, highly detailed",
  "Abstract geometric patterns in vibrant colors, minimalist style",
  "Underwater scene with coral reef and tropical fish, nature photography",
];

// API Configuration with rotation
const API_KEYS = [
  'r8_HhlS8p6MvFNyl2FkcpqbxksqimqbzJC0L7V5D',
  'AmRpyRLxVrWWDbuU_wvcTFbhee1YQQ',
  '53c4e732d41e2ea6b7dab3136f88d2a66e2ded6e782f7368'
];

const PROMPT_TEMPLATES = {
  portrait: "A professional headshot of a person, studio lighting, high-end photography, detailed facial features, DSLR, 85mm lens, bokeh background",
  landscape: "A breathtaking mountain landscape at sunset, dramatic lighting, golden hour, volumetric clouds, ultra-detailed, 8k resolution, wide-angle lens",
  concept: "A futuristic cyberpunk city, neon lights, rain-slicked streets, towering skyscrapers, detailed architecture, moody atmosphere, cinematic lighting",
  product: "A minimalist product photo, clean white background, professional studio lighting, high-end commercial photography, product centered, sharp details",
  fantasy: "A mystical wizard character, intricate magical robes, glowing magical effects, detailed fantasy environment, dramatic lighting, high detail",
  abstract: "An abstract composition of flowing shapes and colors, vibrant color palette, dynamic movement, artistic expression, high resolution artwork"
};

const AIImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("ugly, blurry, poor quality, distorted, low resolution, bad anatomy, bad proportions, deformed");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [size, setSize] = useState("1024x1024");
  const [steps, setSteps] = useState(50);
  const [guidance, setGuidance] = useState(7.5);
  const [customPrompts, setCustomPrompts] = useState<string[]>([]);
  const [newCustomPrompt, setNewCustomPrompt] = useState("");
  const [style, setStyle] = useState("none");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState(0);

  // Add a custom prompt to the list
  const addCustomPrompt = () => {
    if (newCustomPrompt.trim() && !customPrompts.includes(newCustomPrompt.trim())) {
      setCustomPrompts([...customPrompts, newCustomPrompt.trim()]);
      setNewCustomPrompt("");
    }
  };

  // Remove a custom prompt from the list
  const removeCustomPrompt = (promptToRemove: string) => {
    setCustomPrompts(customPrompts.filter(p => p !== promptToRemove));
  };

  // Use a sample or custom prompt
  const usePrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  // Use a template prompt
  const useTemplatePrompt = (templateKey: keyof typeof PROMPT_TEMPLATES) => {
    setPrompt(PROMPT_TEMPLATES[templateKey]);
  };

  // Function to rotate API keys
  const getNextApiKey = () => {
    const nextIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
    setCurrentApiKeyIndex(nextIndex);
    return API_KEYS[nextIndex];
  };

  // Function to make the CORS request
  const makeRequest = () => {
    const corsForm = document.createElement('div');
    corsForm.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 500px; text-align: center;">
          <h2 style="color: #1a1a1a; font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">CORS Access Required</h2>
          <p style="color: #4b5563; margin-bottom: 0.5rem;">This tool requires temporary access to a proxy server.</p>
          <p style="color: #4b5563; margin-bottom: 0.5rem;">Click the button below, then click "Request temporary access to the demo server" on the page that opens.</p>
          <p style="color: #4b5563; margin-bottom: 1.5rem;">After obtaining access, close that tab and come back here to try again.</p>
          <div style="margin-top: 20px;">
            <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-right: 12px; font-weight: 500; transition: all 0.2s;">Get Access</a>
            <button id="aig-retry-button" style="background: #64748b; color: white; padding: 12px 24px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; transition: all 0.2s;">Try Again</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(corsForm);
    
    document.getElementById('aig-retry-button')?.addEventListener('click', () => {
      document.body.removeChild(corsForm);
      handleGenerate();
    });
  };

  const handleTemplateClick = (template: keyof typeof PROMPT_TEMPLATES) => {
    setPrompt(PROMPT_TEMPLATES[template]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setErrorDetails(null);
    setProgress(0);

    try {
      const requestData = {
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt: style !== 'none' ? `${prompt}, ${style} style` : prompt,
          negative_prompt: negativePrompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: parseInt(steps.toString()),
          guidance_scale: 7.5,
          refine: "no_refiner"
        }
      };

      // Make request through CORS Anywhere
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions';
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${API_KEYS[currentApiKeyIndex]}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(requestData)
      });
      
      if (response.status === 403) {
        makeRequest();
        return;
      }
      
      if (!response.ok) {
        if (response.status === 429 || response.status === 402) {
          // Rate limit or quota exceeded - try next API key
          const nextKey = getNextApiKey();
          toast.error("Switching to alternate API key...");
          // Retry with new key
          handleGenerate();
          return;
        }
        throw new Error(`API Error: ${response.status}`);
      }
      
      const predictionData = await response.json();
      const predictionId = predictionData.id;
      
      let pollCount = 0;
      const maxPolls = 60;
      
      const checkStatus = async () => {
        try {
          pollCount++;
          if (pollCount > maxPolls) {
            throw new Error('Timed out waiting for image generation');
          }
          
          const statusUrl = `https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions/${predictionId}`;
          
          const statusResponse = await fetch(statusUrl, {
            headers: {
              'Authorization': `Token ${API_KEYS[currentApiKeyIndex]}`,
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          if (statusResponse.status === 403) {
            makeRequest();
            return;
          }
          
          if (!statusResponse.ok) {
            throw new Error(`Status Check Error: ${statusResponse.status}`);
          }
          
          const statusData = await statusResponse.json();
          
          setProgress((pollCount / maxPolls) * 100);
          
          if (statusData.status === 'succeeded') {
            const imageUrl = statusData.output[0];
            setGeneratedImage(imageUrl);
            toast.success('Image generated successfully!');
            setIsGenerating(false);
            return;
          } else if (statusData.status === 'failed') {
            throw new Error('Image generation failed: ' + (statusData.error || 'Unknown error'));
          } else {
            setTimeout(checkStatus, 2000);
          }
        } catch (error) {
          console.error('Status check error:', error);
          if (error instanceof Error && error.message.includes('Failed to fetch')) {
            makeRequest();
          } else {
            setErrorDetails(error instanceof Error ? error.message : 'Unknown error');
            toast.error("Failed to check generation status");
            setIsGenerating(false);
          }
        }
      };
      
      checkStatus();

      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        const historyKey = `toolHistory_${userEmail}`;
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
        
        const newEntry = {
          toolId: "ai-image-generator",
          toolName: "AI Image Generator",
          prompt: prompt,
          date: new Date().toISOString(),
        };
        
        localStorage.setItem(historyKey, JSON.stringify([newEntry, ...existingHistory]));
      }
    } catch (error) {
      console.error("Image generation error:", error);
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        makeRequest();
      } else {
        setErrorDetails(error instanceof Error ? error.message : 'Unknown error');
        toast.error("Failed to generate image");
        setIsGenerating(false);
      }
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-gradient-to-b from-background to-muted/20">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">AI Image Generator</h2>
          <p className="text-muted-foreground text-lg">Create stunning AI-generated images with advanced controls</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-card rounded-xl p-6 border shadow-sm">
                <label className="text-sm font-medium block mb-3">Image Description</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {Object.entries(PROMPT_TEMPLATES).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 rounded-lg border bg-background/50 hover:border-primary hover:bg-background cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5"
                      onClick={() => handleTemplateClick(key as keyof typeof PROMPT_TEMPLATES)}
                    >
                      <h4 className="text-sm font-medium capitalize mb-2">{key}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{value}</p>
                    </div>
                  ))}
                </div>
                <Input
                  placeholder="Describe the image you want to generate in detail..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  className="min-h-[80px] resize-none bg-background/50"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Be specific with details like style, lighting, composition, etc.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border shadow-sm">
                <label className="text-sm font-medium block mb-3">Negative Prompt</label>
                <Input
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Elements to avoid in the image..."
                  disabled={isGenerating}
                  className="bg-background/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-6 border shadow-sm">
                  <label className="text-sm font-medium block mb-3">Quality</label>
                  <Select value={steps.toString()} onValueChange={(value) => setSteps(parseInt(value))}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">Fast (20 steps)</SelectItem>
                      <SelectItem value="30">Balanced (30 steps)</SelectItem>
                      <SelectItem value="50">High Quality (50 steps)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-card rounded-xl p-6 border shadow-sm">
                  <label className="text-sm font-medium block mb-3">Style</label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="photographic">Photographic</SelectItem>
                      <SelectItem value="digital-art">Digital Art</SelectItem>
                      <SelectItem value="fantasy-art">Fantasy Art</SelectItem>
                      <SelectItem value="oil-painting">Oil Painting</SelectItem>
                      <SelectItem value="watercolor">Watercolor</SelectItem>
                      <SelectItem value="3d-render">3D Render</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full h-12 text-lg font-medium"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border shadow-lg bg-background/50">
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
                  <Loader2 className="h-12 w-12 animate-spin mb-6 text-primary" />
                  <Progress value={progress} className="w-2/3 mb-3" />
                  <p className="text-sm text-muted-foreground">Generating... {Math.round(progress)}%</p>
                </div>
              )}
              {generatedImage && (
                <img
                  src={generatedImage}
                  alt="Generated image"
                  className="w-full h-full object-contain"
                />
              )}
              {!generatedImage && !isGenerating && (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-lg">Your generated image will appear here</p>
                  <p className="text-sm text-muted-foreground/60 mt-2">Start by entering a prompt and clicking generate</p>
                </div>
              )}
            </div>

            {generatedImage && (
              <div className="flex gap-3">
                <Button
                  className="flex-1 h-12"
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Image
                </Button>
                <Button
                  className="flex-1 h-12"
                  variant="secondary"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Generate New
                </Button>
              </div>
            )}

            {errorDetails && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorDetails}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIImageGenerator; 