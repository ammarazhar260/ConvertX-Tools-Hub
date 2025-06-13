import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10 dark:opacity-5"></div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
            <span className="bg-gradient-to-r from-convertx-teal to-convertx-purple bg-clip-text text-transparent text-5xl md:text-7xl block mb-4">
              ConvertX
            </span>
            <span className="text-3xl md:text-5xl">All Your AI & Standard Conversion Tools In One Place</span>
          </h1>
          
          <p className="mt-6 text-xl text-muted-foreground">
            Powerful AI-powered conversion tools and utilities to transform your content with just a few clicks.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tools">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
