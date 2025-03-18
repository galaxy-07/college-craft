
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import CreatePost from "@/components/post/CreatePost";
import PostList from "@/components/post/PostList";
import AnimatedTransition from "@/components/common/AnimatedTransition";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, TrendingUp } from "lucide-react";

const Index = () => {
  const location = useLocation();
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
        
        {!hasSearch && (
          <AnimatedTransition animationType="scale" delay={100}>
            <CreatePost />
          </AnimatedTransition>
        )}
        
        <AnimatedTransition animationType="fade" delay={hasSearch ? 100 : 300}>
          <Tabs value={activeTab} className="w-full">
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
