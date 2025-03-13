
import { ReactNode, useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/common/ThemeToggle";
import AnimatedTransition from "@/components/common/AnimatedTransition";
import Notifications from "@/components/layout/Notifications";
import { Menu, MessageSquare, Search, Tag, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const [searchValue, setSearchValue] = useState("");

  // Extract search query from URL on component mount
  useState(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const query = params.get('q');
      if (query) {
        setSearchValue(query);
      }
    }
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchValue.trim());
      navigate(`${location.pathname}?${url.searchParams.toString()}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <AnimatedTransition animationType="scale" className="w-full max-w-md">
          {children}
        </AnimatedTransition>
      </div>
    );
  }

  // If not logged in and not on an auth page, redirect to login
  if (!isLoading && !user && !isAuthPage) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full h-16 glass glass-dark border-b fixed top-0 z-50 px-4">
        <div className="container h-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold tracking-tight">Campus<span className="text-primary">Anon</span></h1>
          </div>
          
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-md w-full">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search posts, tags, or topics..."
              className="pl-10 bg-secondary/50"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button type="submit" className="sr-only">Search</Button>
          </form>
          
          <div className="flex items-center gap-2">
            <Notifications />
            <ThemeToggle />
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 border-r hidden lg:block fixed h-[calc(100vh-4rem)] top-16">
          <nav className="p-4 h-full flex flex-col">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 font-medium"
                onClick={() => {
                  navigate('/');
                  setSearchValue("");
                }}
              >
                <MessageSquare className="h-5 w-5" />
                <span>All Posts</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 font-medium">
                <Tag className="h-5 w-5" />
                <span>Tags</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 font-medium">
                <Users className="h-5 w-5" />
                <span>My College</span>
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground px-4">POPULAR TAGS</h3>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm font-normal"
                  onClick={() => navigate('/?q=%23events')}
                >
                  #events
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm font-normal"
                  onClick={() => navigate('/?q=%23academics')}
                >
                  #academics
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm font-normal"
                  onClick={() => navigate('/?q=%23campus')}
                >
                  #campus
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm font-normal"
                  onClick={() => navigate('/?q=%23questions')}
                >
                  #questions
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm font-normal"
                  onClick={() => navigate('/?q=%23social')}
                >
                  #social
                </Button>
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="glass glass-dark rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Campus<span className="text-primary">Anon</span></p>
                <p className="text-xs text-muted-foreground">Safe, anonymous discussions for your campus community.</p>
              </div>
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6">
          <AnimatedTransition animationType="fade" className="h-full">
            {children}
          </AnimatedTransition>
        </main>
      </div>
    </div>
  );
};

export default Layout;
