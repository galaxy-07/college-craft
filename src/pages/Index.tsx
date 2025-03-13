
import Layout from "@/components/layout/Layout";
import CreatePost from "@/components/post/CreatePost";
import PostList from "@/components/post/PostList";
import AnimatedTransition from "@/components/common/AnimatedTransition";

const Index = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <AnimatedTransition animationType="scale" delay={100}>
          <CreatePost />
        </AnimatedTransition>
        
        <AnimatedTransition animationType="fade" delay={300}>
          <PostList />
        </AnimatedTransition>
      </div>
    </Layout>
  );
};

export default Index;
