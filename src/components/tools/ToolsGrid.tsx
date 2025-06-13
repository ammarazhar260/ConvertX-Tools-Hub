
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolCard, { ToolProps } from "./ToolCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ToolsGridProps {
  tools: ToolProps[];
}

const ToolsGrid = ({ tools }: ToolsGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Extract unique categories
  const categories = ["all", ...Array.from(new Set(tools.map(tool => tool.category.toLowerCase())))];
  
  // Filter tools based on search query
  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search tools..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Category tabs */}
      <Tabs defaultValue="all">
        <TabsList className="w-full md:w-auto overflow-auto">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Tab content for each category */}
        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools
                .filter(tool => category === "all" || tool.category.toLowerCase() === category)
                .map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
            
            {/* No results message */}
            {filteredTools.filter(tool => category === "all" || tool.category.toLowerCase() === category).length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No tools found matching your search.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ToolsGrid;
