
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import CreatePost from "@/components/post/CreatePost";
import PostList from "@/components/post/PostList";
import AnimatedTransition from "@/components/common/AnimatedTransition";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, TrendingUp } from "lucide-react";

const Index = () => {
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const hasSearch = searchParams.has('q');
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <AnimatedTransition animationType="fade" delay={100}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {hasSearch ? "Search Results" : "Campus Feed"}
            </h1>
            <Tabs 
              defaultValue="recent" 
              className="w-auto"
              onValueChange={setActiveTab}
              value={activeTab}
            >
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="recent" className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Recent</span>
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Trending</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </AnimatedTransition>
        
        {!hasSearch && user && (
          <AnimatedTransition animationType="scale" delay={100}>
            <CreatePost />
          </AnimatedTransition>
        )}
        
        {!user && !hasSearch && (
          <AnimatedTransition animationType="fade" delay={100}>
            <div className="bg-card rounded-lg p-6 mb-6 text-center space-y-4 border">
              <h2 className="text-xl font-semibold">Join the conversation</h2>
              <p className="text-muted-foreground">
                Sign in or create an account to post anonymously and interact with your campus community.
              </p>
              <div className="flex gap-4 justify-center mt-2">
                <Button variant="default" onClick={() => window.location.href = "/login"}>
                  Sign In
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/register"}>
                  Register
                </Button>
              </div>
            </div>
          </AnimatedTransition>
        )}
        
        <AnimatedTransition animationType="fade" delay={hasSearch ? 100 : 300}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="recent" className="mt-0">
              <PostList sortBy="recent" />
            </TabsContent>
            <TabsContent value="trending" className="mt-0">
              <PostList sortBy="trending" />
            </TabsContent>
          </Tabs>
        </AnimatedTransition>
      </div>
    </Layout>
  );
};

export default Index;
