import { createContext, useContext, ReactNode } from "react";
import { Tool, IconType } from "@/types/tool";
import { getIconComponent } from "@/utils/iconUtils";
import { useToolsStorage } from "@/hooks/useToolsStorage";

interface ToolsContextType {
  tools: Tool[];
  addTool: (tool: Omit<Tool, "icon"> & { iconType: string }) => void;
  updateTool: (id: string, tool: Partial<Omit<Tool, "icon"> & { iconType?: string }>) => void;
  deleteTool: (id: string) => void;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: ReactNode }) => {
  const { tools, setTools } = useToolsStorage();

  const addTool = (tool: Omit<Tool, "icon"> & { iconType: string }) => {
    try {
      const icon = getIconComponent(tool.iconType as IconType);
      setTools(prevTools => [
        ...prevTools,
        { ...tool, icon }
      ]);
    } catch (error) {
      console.error("Error adding tool:", error);
      throw new Error("Failed to add tool");
    }
  };

  const updateTool = (id: string, toolUpdates: Partial<Omit<Tool, "icon"> & { iconType?: string }>) => {
    try {
      setTools(prevTools => 
        prevTools.map(tool => {
          if (tool.id === id) {
            const icon = toolUpdates.iconType 
              ? getIconComponent(toolUpdates.iconType as IconType) 
              : tool.icon;
            
            return { 
              ...tool, 
              ...toolUpdates, 
              icon 
            };
          }
          return tool;
        })
      );
    } catch (error) {
      console.error("Error updating tool:", error);
      throw new Error("Failed to update tool");
    }
  };

  const deleteTool = (id: string) => {
    try {
      setTools(prevTools => prevTools.filter(tool => tool.id !== id));
    } catch (error) {
      console.error("Error deleting tool:", error);
      throw new Error("Failed to delete tool");
    }
  };

  return (
    <ToolsContext.Provider value={{ tools, addTool, updateTool, deleteTool }}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context;
};

// Change the re-export syntax to use "export type" for the Tool type
export type { Tool };
