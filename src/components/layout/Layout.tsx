
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import ThemeToggle from "@/components/common/ThemeToggle";
import AnimatedTransition from "@/components/common/AnimatedTransition";
import { Bell, Menu, MessageSquare, Search, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <AnimatedTransition animationType="scale" className="w-full max-w-md">
          {children}
        </AnimatedTransition>
      </div>
    );
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
          
          <div className="hidden md:flex items-center relative max-w-md w-full">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search posts, tags, or topics..."
              className="pl-10 bg-secondary/50"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 border-r hidden lg:block fixed h-[calc(100vh-4rem)] top-16">
          <nav className="p-4 h-full flex flex-col">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3 font-medium">
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
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm font-normal">#events</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm font-normal">#academics</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm font-normal">#campus</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm font-normal">#questions</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm font-normal">#social</Button>
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
