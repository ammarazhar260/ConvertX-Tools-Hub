
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface ToolProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface ToolCardProps {
  tool: ToolProps;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Card className="card-hover overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
          {tool.icon}
        </div>
        <CardTitle>{tool.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <CardDescription className="text-base">{tool.description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <Link to={`/tools/${tool.id}`} className="w-full">
          <Button variant="ghost" className="w-full justify-between">
            Use Tool
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
