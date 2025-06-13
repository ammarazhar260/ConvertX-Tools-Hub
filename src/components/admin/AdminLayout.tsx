
import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication on mount
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    
    if (!isAdminLoggedIn) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You must be logged in to access the admin area.",
      });
      navigate("/admin");
    }
  }, [navigate, toast]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
