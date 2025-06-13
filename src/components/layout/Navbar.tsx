import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = () => {
      const userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");
      setIsLoggedIn(!!userEmail);
      
      if (userEmail) {
        if (userName) {
          const initials = userName
            .split(" ")
            .map(part => part[0])
            .join("")
            .toUpperCase();
          setUserInitials(initials);
        } else {
          const emailInitials = userEmail.split("@")[0]
            .split(".")
            .map(part => part[0])
            .join("")
            .toUpperCase();
          setUserInitials(emailInitials);
        }
      }
    };
    
    checkLoginStatus();
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-40 w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-convertx-teal to-convertx-purple bg-clip-text text-transparent font-bold text-2xl">
            ConvertX
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`transition-colors flex items-center gap-1 ${isActive('/') 
              ? 'text-primary font-medium' 
              : 'text-foreground hover:text-primary'}`}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link 
            to="/tools" 
            className={`transition-colors ${isActive('/tools') 
              ? 'text-primary font-medium' 
              : 'text-foreground hover:text-primary'}`}
          >
            Tools
          </Link>
          <Link 
            to="/about" 
            className={`transition-colors ${isActive('/about') 
              ? 'text-primary font-medium' 
              : 'text-foreground hover:text-primary'}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`transition-colors ${isActive('/contact') 
              ? 'text-primary font-medium' 
              : 'text-foreground hover:text-primary'}`}
          >
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <Link to="/profile">
              <Avatar className="h-9 w-9 hover:ring-2 hover:ring-primary/50 transition-all">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          {isLoggedIn && (
            <Link to="/profile">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`transition-colors py-2 flex items-center gap-2 ${isActive('/') 
                ? 'text-primary font-medium' 
                : 'text-foreground hover:text-primary'}`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link 
              to="/tools" 
              className={`transition-colors py-2 ${isActive('/tools') 
                ? 'text-primary font-medium' 
                : 'text-foreground hover:text-primary'}`}
            >
              Tools
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors py-2 ${isActive('/about') 
                ? 'text-primary font-medium' 
                : 'text-foreground hover:text-primary'}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors py-2 ${isActive('/contact') 
                ? 'text-primary font-medium' 
                : 'text-foreground hover:text-primary'}`}
            >
              Contact
            </Link>
            <div className="pt-4 border-t flex flex-col space-y-3">
              {isLoggedIn ? (
                <Link to="/profile">
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
