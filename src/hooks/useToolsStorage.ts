import { useState, useEffect } from "react";
import { Tool, IconType } from "@/types/tool";
import { getIconComponent, getIconTypeFromComponent } from "@/utils/iconUtils";
import { defaultTools } from "@/data/defaultTools";

interface StoredTool extends Omit<Tool, 'icon'> {
  iconType: string;
}

export const useToolsStorage = () => {
  const [tools, setTools] = useState<Tool[]>(defaultTools);
  
  // Load tools from localStorage on component mount
  useEffect(() => {
    const storedTools = localStorage.getItem("tools");
    if (storedTools) {
      try {
        // Parse stored tools and restore icon components
        const parsedTools = JSON.parse(storedTools) as StoredTool[];
        const restoredTools = parsedTools.map((tool) => ({
          ...tool,
          icon: getIconComponent(tool.iconType as IconType)
        }));
        setTools(restoredTools);
      } catch (error) {
        console.error("Error parsing stored tools:", error);
        // Reset to default tools if there's an error
        setTools(defaultTools);
      }
    }
  }, []);

  // Save tools to localStorage whenever they change
  useEffect(() => {
    try {
      // Save tools with iconType instead of icon component
      const toolsToStore = tools.map(tool => {
        const iconType = getIconTypeFromComponent(tool.icon);
        
        return {
          ...tool,
          icon: undefined, // Don't store React components
          iconType // Store icon type as string
        };
      });
      
      localStorage.setItem("tools", JSON.stringify(toolsToStore));
    } catch (error) {
      console.error("Error saving tools to localStorage:", error);
    }
  }, [tools]);

  return { tools, setTools };
};
