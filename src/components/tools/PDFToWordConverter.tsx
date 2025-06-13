import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Download, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const PDFToWordConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(selectedFile);
      setIsCompleted(false);
      setConversionProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(droppedFile);
      setIsCompleted(false);
      setConversionProgress(0);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error("Please upload a PDF file first");
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);

    try {
      // Simulate conversion progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setConversionProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Convert the file (simulated conversion)
      const buffer = await file.arrayBuffer();
      const convertedBlob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const convertedUrl = URL.createObjectURL(convertedBlob);

      setIsCompleted(true);
      toast.success("Conversion completed!");

      // Get user email
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        // Log the conversion in tool history
        const historyKey = `toolHistory_${userEmail}`;
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
        
        const newEntry = {
          id: Date.now().toString(),
          toolId: "pdf-to-word",
          toolName: "PDF to Word",
          category: "Document Conversion",
          usedAt: new Date(),
          fileName: file.name
        };
        
        localStorage.setItem(historyKey, JSON.stringify([newEntry, ...existingHistory]));

        // Store the file in user's storage
        const filesKey = `userFiles_${userEmail}`;
        const existingFiles = JSON.parse(localStorage.getItem(filesKey) || "[]");
        
        // Create converted file name
        const convertedName = file.name.replace(/\.pdf$/i, ".docx");
        
        const newFile = {
          id: Date.now().toString(),
          originalName: file.name,
          convertedName: convertedName,
          originalSize: file.size,
          convertedSize: convertedBlob.size,
          convertedAt: new Date(),
          toolId: "pdf-to-word",
          toolName: "PDF to Word",
          downloadUrl: convertedUrl,
          status: 'completed'
        };
        
        // Store the file data in localStorage
        localStorage.setItem(filesKey, JSON.stringify([newFile, ...existingFiles]));
        
        // Store the converted file URL for later download
        localStorage.setItem(`convertedFile_${newFile.id}`, convertedUrl);
      }
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Conversion failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    if (!file || !isCompleted) {
      toast.error("Please convert a file first");
      return;
    }
    
    try {
      // Create a new blob from the file
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      // Create filename with .docx extension
      const fileName = file.name.replace(/\.pdf$/i, ".docx");
      
      // Create download link using native browser download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
      
      toast.success("Download started!");

      // Store in user's profile
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        const filesKey = `userFiles_${userEmail}`;
        const existingFiles = JSON.parse(localStorage.getItem(filesKey) || "[]");
        
        const newFile = {
          id: Date.now().toString(),
          originalName: file.name,
          convertedName: fileName,
          originalSize: file.size,
          convertedSize: blob.size,
          convertedAt: new Date(),
          toolId: "pdf-to-word",
          toolName: "PDF to Word",
          status: 'completed'
        };
        
        localStorage.setItem(filesKey, JSON.stringify([newFile, ...existingFiles]));
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Please try again.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setIsCompleted(false);
    setConversionProgress(0);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="convert">
          <TabsList className="mb-6">
            <TabsTrigger value="convert">Convert</TabsTrigger>
            <TabsTrigger value="options" disabled={isConverting}>Options</TabsTrigger>
          </TabsList>

          <TabsContent value="convert" className="space-y-6">
            {!file ? (
              <div
                className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("pdf-file-input")?.click()}
              >
                <input
                  type="file"
                  id="pdf-file-input"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Upload a PDF file</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {isConverting || isCompleted ? (
                  <div className="space-y-2">
                    <Progress value={conversionProgress} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">
                      {isCompleted ? "Conversion completed!" : `Converting... ${conversionProgress}%`}
                    </p>
                  </div>
                ) : null}

                <div className="flex space-x-2">
                  <Button
                    className="flex-1"
                    onClick={handleConvert}
                    disabled={isConverting || isCompleted}
                  >
                    {isConverting ? "Converting..." : "Convert to Word"}
                  </Button>
                  {isCompleted && (
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <div className="text-center text-muted-foreground">
              <p>Basic conversion options are available in the free version.</p>
              <p>Upgrade to access advanced conversion settings.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PDFToWordConverter;
