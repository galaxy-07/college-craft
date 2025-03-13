
import Layout from "@/components/layout/Layout";
import CreatePost from "@/components/post/CreatePost";
import PostList from "@/components/post/PostList";
import AnimatedTransition from "@/components/common/AnimatedTransition";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hasSearch = searchParams.has('q');

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {!hasSearch && (
          <AnimatedTransition animationType="scale" delay={100}>
            <CreatePost />
          </AnimatedTransition>
        )}
        
        <AnimatedTransition animationType="fade" delay={hasSearch ? 100 : 300}>
          <PostList />
        </AnimatedTransition>
      </div>
    </Layout>
  );
};

export default Index;
