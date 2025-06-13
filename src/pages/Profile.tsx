import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, isValid, parseISO } from "date-fns";
import { 
  User, 
  Settings, 
  LogOut,
  Clock,
  Lock,
  FileText,
  Download,
  Trash2,
  FolderOpen,
  Camera,
  Eye,
  EyeOff,
  Shield,
  Mail,
  Phone
} from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ToolUsage {
  id: string;
  toolId: string;
  toolName: string;
  category: string;
  usedAt: Date;
  result?: string;
}

interface StoredFile {
  id: string;
  originalName: string;
  convertedName: string;
  originalSize: number;
  convertedSize: number;
  convertedAt: Date;
  toolId: string;
  toolName: string;
  downloadUrl: string;
  status: 'completed' | 'failed';
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);
  const [recentTools, setRecentTools] = useState<ToolUsage[]>([]);
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);
  const [storageUsed, setStorageUsed] = useState(0); // in MB
  const [storageLimit] = useState(1000); // 1GB limit
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'profile' | 'files' | 'recent-activity' | 'settings'>('profile');

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    
    if (!storedEmail) {
      navigate("/login");
      return;
    }

    const timer = setTimeout(() => {
      const name = storedName || storedEmail.split("@")[0]
        .split(".")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

      setUserProfile({
        name,
        email: storedEmail,
      });

      // Load tool history
      let toolHistory = JSON.parse(localStorage.getItem(`toolHistory_${storedEmail}`) || "[]");
      const processedTools = toolHistory.map((tool: any) => {
        let dateObj;
        try {
          if (typeof tool.usedAt === 'string') {
            dateObj = parseISO(tool.usedAt);
            if (!isValid(dateObj)) {
              dateObj = new Date();
            }
          } else {
            dateObj = new Date();
          }
        } catch (e) {
          console.error("Error parsing date:", e);
          dateObj = new Date();
        }

        return {
          ...tool,
          usedAt: dateObj
        };
      });

      setRecentTools(processedTools);

      // Load stored files
      const storedFilesData = JSON.parse(localStorage.getItem(`userFiles_${storedEmail}`) || "[]");
      const processedFiles = storedFilesData.map((file: any) => ({
        ...file,
        convertedAt: parseISO(file.convertedAt)
      }));
      setStoredFiles(processedFiles);

      // Calculate storage used
      const totalSize = processedFiles.reduce((acc: number, file: StoredFile) => 
        acc + file.originalSize + file.convertedSize, 0);
      setStorageUsed(Math.round(totalSize / (1024 * 1024))); // Convert to MB

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate("/");
  };

  const formatSafeDate = (date: Date, formatString: string) => {
    try {
      if (!isValid(date)) return "Invalid date";
      return format(date, formatString);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteFile = (fileId: string) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    const updatedFiles = storedFiles.filter(file => file.id !== fileId);
    setStoredFiles(updatedFiles);
    localStorage.setItem(`userFiles_${userEmail}`, JSON.stringify(updatedFiles));

    // Recalculate storage used
    const totalSize = updatedFiles.reduce((acc, file) => 
      acc + file.originalSize + file.convertedSize, 0);
    setStorageUsed(Math.round(totalSize / (1024 * 1024)));

    toast({
      title: "File deleted",
      description: "The file has been removed from your storage.",
    });
  };

  const handleDownloadFile = (file: StoredFile) => {
    // In a real implementation, this would download from your server
    // For demo purposes, we'll just show a success message
    toast({
      title: "Download started",
      description: `Downloading ${file.convertedName}...`,
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeLoading(true);
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation don't match.",
        variant: "destructive",
      });
      setPasswordChangeLoading(false);
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Your new password must be at least 6 characters long.",
        variant: "destructive",
      });
      setPasswordChangeLoading(false);
      return;
    }
    
    const email = localStorage.getItem("userEmail");
    if (!email) {
      toast({
        title: "Authentication error",
        description: "You need to be logged in to change your password.",
        variant: "destructive",
      });
      setPasswordChangeLoading(false);
      return;
    }
    
    const storedPassword = localStorage.getItem(`userPassword_${email}`);
    
    if (storedPassword && storedPassword !== currentPassword) {
      toast({
        title: "Incorrect password",
        description: "Your current password is incorrect.",
        variant: "destructive",
      });
      setPasswordChangeLoading(false);
      return;
    }
    
    localStorage.setItem(`userPassword_${email}`, newPassword);
    
    setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordChangeLoading(false);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    }, 1000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // Save to localStorage
        if (typeof reader.result === 'string') {
          const userEmail = localStorage.getItem("userEmail");
          if (userEmail) {
            localStorage.setItem(`userAvatar_${userEmail}`, reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Load avatar from localStorage
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      const savedAvatar = localStorage.getItem(`userAvatar_${userEmail}`);
      if (savedAvatar) {
        setAvatarPreview(savedAvatar);
      }
    }
  }, []);

  // Add delete avatar function
  const handleDeleteAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been deleted.",
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt={userProfile?.name} />
                      ) : (
                        <AvatarFallback>
                          {userProfile?.name?.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute bottom-0 right-0">
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold">{userProfile?.name}</h2>
                  <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                  
                  <div className="mt-6 space-y-2 w-full">
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${activeView === 'profile' ? 'bg-muted' : ''}`}
                      onClick={() => setActiveView('profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${activeView === 'files' ? 'bg-muted' : ''}`}
                      onClick={() => setActiveView('files')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Files
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${activeView === 'recent-activity' ? 'bg-muted' : ''}`}
                      onClick={() => setActiveView('recent-activity')}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Recent Activity
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${activeView === 'settings' ? 'bg-muted' : ''}`}
                      onClick={() => setActiveView('settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            {activeView === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome Back, {userProfile?.name}</CardTitle>
                    <CardDescription>
                      View your recent tool usage and account activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                          <Clock className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium">Recent Tools</h3>
                        <p className="text-2xl font-bold">{recentTools.length}</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                          <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium">Stored Files</h3>
                        <p className="text-2xl font-bold">{storedFiles.length}</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                          <FolderOpen className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium">Storage Used</h3>
                        <p className="text-2xl font-bold">{storageUsed} MB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recently Used Tools</CardTitle>
                    <CardDescription>
                      Your most recently used conversion tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentTools.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>You haven't used any tools yet.</p>
                        <Button className="mt-4" asChild>
                          <Link to="/tools">Explore Tools</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentTools.slice(0, 3).map((tool) => (
                          <div key={tool.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                            <div>
                              <h4 className="font-medium">{tool.toolName}</h4>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span className="bg-muted px-2 py-0.5 rounded text-xs mr-2">
                                  {tool.category}
                                </span>
                                <span>{formatSafeDate(tool.usedAt, 'PPP')}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/tools/${tool.toolId}`}>Use Again</Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeView === 'files' && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Files</CardTitle>
                  <CardDescription>
                    Manage your converted files and documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {storedFiles.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="mb-2">No files stored yet</p>
                      <p className="text-sm mb-6">
                        Convert some files using our tools and they'll appear here
                      </p>
                      <Button asChild>
                        <Link to="/tools">Go to Tools</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Tool Used</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {storedFiles.map((file) => (
                            <TableRow key={file.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{file.convertedName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Original: {file.originalName}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>{file.toolName}</TableCell>
                              <TableCell>
                                {formatSafeDate(file.convertedAt, 'PPP')}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="text-sm">Original: {formatFileSize(file.originalSize)}</p>
                                  <p className="text-sm">Converted: {formatFileSize(file.convertedSize)}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={file.status === 'completed' ? 'default' : 'destructive'}
                                >
                                  {file.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDownloadFile(file)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteFile(file.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeView === 'recent-activity' && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    A detailed log of your tool usage and activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tool</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTools.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No activity found
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentTools.map((tool) => (
                          <TableRow key={tool.id}>
                            <TableCell className="font-medium">{tool.toolName}</TableCell>
                            <TableCell>{tool.category}</TableCell>
                            <TableCell>{formatSafeDate(tool.usedAt, 'PPP p')}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/tools/${tool.toolId}`}>
                                  Use Again
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeView === 'settings' && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Update your personal information and profile settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input 
                        id="display-name" 
                        value={userProfile?.name || ''} 
                        onChange={(e) => setUserProfile(prev => prev ? {...prev, name: e.target.value} : null)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="email" 
                          type="email"
                          value={userProfile?.email || ''} 
                          disabled
                        />
                        <Button variant="outline" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="phone" 
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                        />
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="current-password" 
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input 
                            id="new-password" 
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                          <Input 
                            id="confirm-password" 
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="two-factor"
                          checked={twoFactorEnabled}
                          onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="two-factor" className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Enable Two-Factor Authentication
                        </Label>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={passwordChangeLoading}>
                        {passwordChangeLoading ? (
                          <>
                            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Update Security Settings
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Password requirements:</p>
                      <ul className="list-disc list-inside">
                        <li>At least 8 characters long</li>
                        <li>Must contain at least one uppercase letter</li>
                        <li>Must contain at least one number</li>
                        <li>Must contain at least one special character</li>
                      </ul>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
