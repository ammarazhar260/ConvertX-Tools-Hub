
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Wrench, LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel.",
    });
    navigate("/admin");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-convertx-teal to-convertx-purple bg-clip-text text-transparent font-bold text-2xl">
            ConvertX
          </span>
          <span className="font-semibold text-foreground">Admin</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link 
          to="/admin/dashboard" 
          className={`flex items-center space-x-3 p-2 rounded-md ${
            isActive("/admin/dashboard") 
              ? "bg-gray-100 dark:bg-gray-700 text-primary" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/admin/users"
          className={`flex items-center space-x-3 p-2 rounded-md ${
            isActive("/admin/users") 
              ? "bg-gray-100 dark:bg-gray-700 text-primary" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          <Users size={20} />
          <span>Users</span>
        </Link>
        
        <Link
          to="/admin/tools"
          className={`flex items-center space-x-3 p-2 rounded-md ${
            isActive("/admin/tools") 
              ? "bg-gray-100 dark:bg-gray-700 text-primary" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          <Wrench size={20} />
          <span>Tools</span>
        </Link>
        
        <Link
          to="/admin/settings"
          className={`flex items-center space-x-3 p-2 rounded-md ${
            isActive("/admin/settings") 
              ? "bg-gray-100 dark:bg-gray-700 text-primary" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center space-x-2" 
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
