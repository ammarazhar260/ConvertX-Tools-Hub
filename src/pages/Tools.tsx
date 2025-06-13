
import MainLayout from "@/components/layout/MainLayout";
import ToolsGrid from "@/components/tools/ToolsGrid";
import { useTools } from "@/context/ToolsContext";

const Tools = () => {
  // Get tools from context
  const { tools } = useTools();
  
  // Filter only active tools for the public page
  const activeTools = tools.filter(tool => tool.status === "active" || tool.status === undefined);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Conversion Tools</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover our collection of powerful conversion tools to transform your content.
          </p>
        </div>
        
        <ToolsGrid tools={activeTools} />
      </div>
    </MainLayout>
  );
};

export default Tools;
