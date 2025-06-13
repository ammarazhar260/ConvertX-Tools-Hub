
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash, Wrench, Code, FileCode, FileText, ImageIcon, Zap, Calculator, Wand2, VolumeIcon, ClipboardCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTools, Tool } from "@/context/ToolsContext";

interface ToolFile {
  name: string;
  content: string;
}

// Form schema for adding/editing tools
const toolFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  status: z.enum(["active", "disabled", "beta"], {
    message: "Status must be active, disabled, or beta.",
  }),
  icon: z.string().min(1, { message: "Icon is required." }),
  implementation: z.string().optional(),
});

type ToolFormValues = z.infer<typeof toolFormSchema>;

const AdminTools = () => {
  const { tools, addTool, updateTool, deleteTool } = useTools();
  
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);
  const [isEditToolOpen, setIsEditToolOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool | null>(null);
  const [toolFiles, setToolFiles] = useState<ToolFile[]>([]);
  const { toast } = useToast();

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      status: "active",
      icon: "Wand2",
      implementation: "",
    },
  });

  const editForm = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      status: "active",
      icon: "Wand2",
      implementation: "",
    },
  });

  // Update filteredTools when tools change
  useEffect(() => {
    setFilteredTools(tools);
  }, [tools]);

  // Filter tools based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredTools(tools);
      return;
    }
    
    const lowerCaseQuery = query.toLowerCase();
    const filtered = tools.filter(
      tool => 
        tool.title.toLowerCase().includes(lowerCaseQuery) || 
        tool.description.toLowerCase().includes(lowerCaseQuery) ||
        tool.category.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredTools(filtered);
  };

  const handleAddTool = (data: ToolFormValues) => {
    // Create ID from name (slugify)
    const id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check if tool with same ID already exists
    if (tools.some(tool => tool.id === id)) {
      toast({
        variant: "destructive",
        title: "Tool already exists",
        description: "A tool with a similar name already exists.",
      });
      return;
    }
    
    // Prepare implementation from form data and additional files
    let implementation = data.implementation || "";
    
    // If there are additional files, we could append them to the implementation
    // or handle them differently based on requirements
    if (toolFiles.length > 0) {
      // For this example, we're just appending file content as comments
      const filesContent = toolFiles.map(file => 
        `// File: ${file.name}\n${file.content}\n`
      ).join("\n");
      
      implementation = implementation + "\n\n" + filesContent;
    }
    
    // Add tool to context
    addTool({
      id,
      title: data.name,
      description: data.description,
      category: data.category,
      status: data.status,
      iconType: data.icon,
      implementation, // Add implementation to the tool
    });
    
    toast({
      title: "Tool added",
      description: `Tool "${data.name}" has been added successfully.`,
    });
    
    form.reset();
    setToolFiles([]);
    setIsAddToolOpen(false);
  };

  const handleEditTool = (data: ToolFormValues) => {
    if (!currentTool) return;
    
    // Prepare implementation from form data and additional files
    let implementation = data.implementation || "";
    
    // If there are additional files, append them to the implementation
    if (toolFiles.length > 0) {
      const filesContent = toolFiles.map(file => 
        `// File: ${file.name}\n${file.content}\n`
      ).join("\n");
      
      implementation = implementation + "\n\n" + filesContent;
    }
    
    // Update tool in context
    updateTool(currentTool.id, {
      title: data.name,
      description: data.description,
      category: data.category,
      status: data.status,
      iconType: data.icon,
      implementation, // Update implementation
    });
    
    toast({
      title: "Tool updated",
      description: `Tool "${data.name}" has been updated successfully.`,
    });
    
    editForm.reset();
    setCurrentTool(null);
    setToolFiles([]);
    setIsEditToolOpen(false);
  };

  const handleDeleteTool = (toolId: string) => {
    // Delete tool from context
    deleteTool(toolId);
    
    toast({
      title: "Tool deleted",
      description: "The tool has been deleted successfully.",
    });
  };

  const openEditToolDialog = (tool: Tool) => {
    setCurrentTool(tool);
    setToolFiles([]); // Initialize with empty array as Tool doesn't have files property
    
    // Extract icon type from tool
    let iconType = "Wand2";
    if (tool.icon && typeof tool.icon === "object") {
      const iconString = (tool.icon as JSX.Element).type.toString();
      const matches = iconString.match(/function\s+(\w+)/);
      if (matches && matches[1]) {
        iconType = matches[1];
      }
    }
    
    // Set form values including implementation
    editForm.reset({
      name: tool.title,
      description: tool.description,
      category: tool.category,
      status: tool.status || "active",
      icon: iconType,
      implementation: tool.implementation || "", // Include the tool's implementation code
    });
    
    setIsEditToolOpen(true);
  };

  const addToolFile = () => {
    setToolFiles([...toolFiles, { name: `file${toolFiles.length + 1}.js`, content: "// Write your code here" }]);
  };

  const updateToolFile = (index: number, field: 'name' | 'content', value: string) => {
    const updatedFiles = [...toolFiles];
    updatedFiles[index] = { ...updatedFiles[index], [field]: value };
    setToolFiles(updatedFiles);
  };

  const removeToolFile = (index: number) => {
    setToolFiles(toolFiles.filter((_, i) => i !== index));
  };

  const getStatusBadge = (status: Tool["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "disabled":
        return <Badge variant="secondary">Disabled</Badge>;
      case "beta":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Beta</Badge>;
      default:
        return <Badge className="bg-green-500">Active</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Tool Management</h1>
        
        <Dialog open={isAddToolOpen} onOpenChange={setIsAddToolOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Tool</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddTool)} className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Information</TabsTrigger>
                    <TabsTrigger value="implementation">Implementation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="PDF to DOCX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Convert PDF files to Word documents" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Converter">Converter</SelectItem>
                              <SelectItem value="AI">AI</SelectItem>
                              <SelectItem value="Utility">Utility</SelectItem>
                              <SelectItem value="Generator">Generator</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="disabled">Disabled</SelectItem>
                              <SelectItem value="beta">Beta</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an icon" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FileText">Document</SelectItem>
                              <SelectItem value="ImageIcon">Image</SelectItem>
                              <SelectItem value="Zap">Lightning</SelectItem>
                              <SelectItem value="FileCode">Code</SelectItem>
                              <SelectItem value="Calculator">Calculator</SelectItem>
                              <SelectItem value="Wand2">Wand</SelectItem>
                              <SelectItem value="VolumeIcon">Audio</SelectItem>
                              <SelectItem value="ClipboardCopy">Clipboard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="implementation" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="implementation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Implementation Code</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="// Add your implementation code here" 
                              className="font-mono text-sm min-h-[200px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Tool Files</h4>
                        <Button type="button" variant="outline" size="sm" onClick={addToolFile}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add File
                        </Button>
                      </div>
                      
                      {toolFiles.map((file, index) => (
                        <div key={index} className="space-y-2 border p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                              <Input 
                                value={file.name} 
                                onChange={(e) => updateToolFile(index, 'name', e.target.value)}
                                className="max-w-[300px]"
                                placeholder="filename.js"
                              />
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeToolFile(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea 
                            value={file.content}
                            onChange={(e) => updateToolFile(index, 'content', e.target.value)}
                            className="font-mono text-sm min-h-[150px]"
                            placeholder="// Write your code here"
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddToolOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Wrench className="mr-2 h-4 w-4" />
                    Add Tool
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditToolOpen} onOpenChange={setIsEditToolOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Tool</DialogTitle>
            </DialogHeader>
            {currentTool && (
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(handleEditTool)} className="space-y-4">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">Basic Information</TabsTrigger>
                      <TabsTrigger value="implementation">Implementation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="space-y-4 pt-4">
                      <FormField
                        control={editForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="PDF to DOCX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={editForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Convert PDF files to Word documents" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={editForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Converter">Converter</SelectItem>
                                <SelectItem value="AI">AI</SelectItem>
                                <SelectItem value="Utility">Utility</SelectItem>
                                <SelectItem value="Generator">Generator</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={editForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="disabled">Disabled</SelectItem>
                                <SelectItem value="beta">Beta</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={editForm.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="FileText">Document</SelectItem>
                                <SelectItem value="ImageIcon">Image</SelectItem>
                                <SelectItem value="Zap">Lightning</SelectItem>
                                <SelectItem value="FileCode">Code</SelectItem>
                                <SelectItem value="Calculator">Calculator</SelectItem>
                                <SelectItem value="Wand2">Wand</SelectItem>
                                <SelectItem value="VolumeIcon">Audio</SelectItem>
                                <SelectItem value="ClipboardCopy">Clipboard</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="implementation" className="space-y-4 pt-4">
                      <FormField
                        control={editForm.control}
                        name="implementation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Implementation Code</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="// Add your implementation code here" 
                                className="font-mono text-sm min-h-[200px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Tool Files</h4>
                          <Button type="button" variant="outline" size="sm" onClick={addToolFile}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add File
                          </Button>
                        </div>
                        
                        {toolFiles.map((file, index) => (
                          <div key={index} className="space-y-2 border p-4 rounded-md">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input 
                                  value={file.name} 
                                  onChange={(e) => updateToolFile(index, 'name', e.target.value)}
                                  className="max-w-[300px]"
                                  placeholder="filename.js"
                                />
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeToolFile(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea 
                              value={file.content}
                              onChange={(e) => updateToolFile(index, 'content', e.target.value)}
                              className="font-mono text-sm min-h-[150px]"
                              placeholder="// Write your code here"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsEditToolOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tools</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    {searchQuery ? "No tools found matching your search" : "No tools found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.title}</TableCell>
                    <TableCell>{tool.description}</TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>{getStatusBadge(tool.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditToolDialog(tool)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteTool(tool.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTools;
