
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface DynamicToolRendererProps {
  toolId: string;
  implementation: string;
}

const DynamicToolRenderer = ({ toolId, implementation }: DynamicToolRendererProps) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!implementation) {
      setError("No implementation code provided for this tool.");
      return;
    }

    try {
      // Try to convert the implementation string to a React component
      const transformedCode = transformCodeToComponent(implementation);
      
      // Use Function constructor to evaluate the code and get the component
      // Note: This approach has security implications and should be used with caution
      // Only admin-provided code should be executed this way
      const ComponentFunction = new Function('React', transformedCode);
      const DynamicComponent = ComponentFunction(React);
      
      setComponent(() => DynamicComponent);
      setError(null);
    } catch (err) {
      console.error(`Error rendering tool ${toolId}:`, err);
      setError(`Error rendering tool: ${err instanceof Error ? err.message : String(err)}`);
      toast.error('Failed to render tool implementation');
    }
  }, [toolId, implementation]);

  // Helper function to transform the code string into a component
  const transformCodeToComponent = (code: string): string => {
    // This is a simplified transformation for demo purposes
    // In a real implementation, you might want to use a more robust approach
    
    // Handle imports by replacing them with imports available in the context
    const processedCode = code
      .replace(/import\s+{([^}]+)}\s+from\s+['"]@\/components\/ui\/([^'"]+)['"]/g, 
              (_, imports) => `// Import ${imports} from UI components`)
      .replace(/import\s+React[^;]*;/g, '// React is already imported')
      .replace(/export\s+default\s+(\w+);?/g, 'return $1;');
      
    return processedCode;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Implementation Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!Component) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  try {
    return <Component />;
  } catch (err) {
    console.error(`Error rendering component for tool ${toolId}:`, err);
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Rendering Error</p>
            <p className="text-sm">{err instanceof Error ? err.message : String(err)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
};

export default DynamicToolRenderer;
