import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const Footer = () => {
  const socialLinks = {
    twitter: "https://twitter.com/convertx_app",
    linkedin: "https://linkedin.com/company/convertx",
    github: "https://github.com/convertx",
    discord: "https://discord.gg/convertx"
  };

  const handleSocialClick = (platform: keyof typeof socialLinks) => {
    window.open(socialLinks[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - Logo & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-convertx-teal to-convertx-purple bg-clip-text text-transparent font-bold text-2xl">
                ConvertX
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground">
              Your one-stop platform for AI-powered conversion tools and utilities.
            </p>
          </div>

          {/* Column 2 - Tools */}
          <div>
            <h3 className="font-medium text-lg mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools?category=AI" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link to="/tools?category=Converter" className="text-muted-foreground hover:text-foreground transition-colors">
                  Converters
                </Link>
              </li>
              <li>
                <Link to="/tools?category=Generator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Generators
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ConvertX. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <button 
              onClick={() => handleSocialClick('twitter')}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              aria-label="Twitter"
            >
              Twitter <ExternalLink className="h-3 w-3" />
            </button>
            <button 
              onClick={() => handleSocialClick('linkedin')}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              aria-label="LinkedIn"
            >
              LinkedIn <ExternalLink className="h-3 w-3" />
            </button>
            <button 
              onClick={() => handleSocialClick('github')}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              aria-label="GitHub"
            >
              GitHub <ExternalLink className="h-3 w-3" />
            </button>
            <button 
              onClick={() => handleSocialClick('discord')}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              aria-label="Discord"
            >
              Discord <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
