import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-convertx-teal via-blue-600 to-convertx-purple relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
          Ready to transform your workflow?
        </h2>
        <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
          Join thousands of users who are already saving time and effort with our powerful tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white hover:bg-white/90 text-blue-600 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
              Get Started Free
            </Button>
          </Link>
          <Link to="/tools">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border-white border-2 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
              Browse Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
