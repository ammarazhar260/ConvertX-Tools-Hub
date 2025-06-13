
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About ConvertX</h1>
          <p className="text-xl text-muted-foreground">
            We're building the ultimate free toolkit for all your conversion needs
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              ConvertX was founded with a simple but powerful mission: to make powerful conversion tools accessible to everyone, completely free of charge.
            </p>
            <p className="text-lg text-muted-foreground">
              We believe that technology should help break down barriers, not create them. That's why we've dedicated ourselves to building a platform that anyone can use without paywalls or restrictions.
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-convertx-teal to-convertx-purple p-1">
            <div className="w-full h-full bg-background rounded-md flex items-center justify-center p-8">
              <div className="text-center">
                <span className="bg-gradient-to-r from-convertx-teal to-convertx-purple bg-clip-text text-transparent font-bold text-5xl">
                  Free Tools For Everyone
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">AI-Powered Tools</h3>
              <p className="text-muted-foreground mb-4">
                Leverage cutting-edge artificial intelligence to transform your content in ways that were previously impossible or prohibitively expensive.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">File Converters</h3>
              <p className="text-muted-foreground mb-4">
                Transform files between different formats without losing quality or formatting, all processed securely on our servers.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">Utility Tools</h3>
              <p className="text-muted-foreground mb-4">
                Access handy utilities for everyday tasks, designed to be intuitive and efficient so you can get things done quickly.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-card rounded-lg p-8 shadow-sm border text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Start Using ConvertX Today</h2>
          <p className="text-muted-foreground mb-6">
            Explore our collection of free tools and start converting, transforming, and creating right away.
          </p>
          <Link to="/tools">
            <Button size="lg" className="mr-4">Explore Tools</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
