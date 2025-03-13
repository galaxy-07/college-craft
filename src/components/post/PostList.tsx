
import { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

// Dummy data for posts
const dummyPosts = [
  {
    id: "1",
    anonymousId: "a7f3e9b1",
    content: "Just found out our department is getting a major upgrade to the computer labs next semester! New machines coming in with RTX graphics cards. 🔥 Has anyone heard more details about this?",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    tags: ["tech", "campus", "news"],
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    likes: 24,
    dislikes: 2,
    comments: 7,
  },
  {
    id: "2",
    anonymousId: "b3c1d9a7",
    content: "The food at the North Campus dining hall has been terrible lately. Anyone else notice this or is it just me? I found something in my pasta yesterday that definitely wasn't supposed to be there...",
    tags: ["food", "complaints"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 56,
    dislikes: 3,
    comments: 18,
  },
  {
    id: "3",
    anonymousId: "e5g7h9j2",
    content: "Professor Wilson's surprise quiz today caught everyone off guard. Half the class probably failed. How is this fair when it wasn't on the syllabus?",
    tags: ["academics", "professors"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 89,
    dislikes: 7,
    comments: 32,
  },
  {
    id: "4",
    anonymousId: "k4m6n8p1",
    content: "Anyone looking for a study group for Dr. Lee's Organic Chemistry course? The final is coming up and I'm completely lost with reaction mechanisms.",
    imageUrl: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14",
    tags: ["study", "chemistry", "help"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    likes: 15,
    dislikes: 0,
    comments: 9,
  },
  {
    id: "5",
    anonymousId: "q2s4u6w8",
    content: "The new campus policy on overnight guests is ridiculous. We're adults paying for this housing, not children who need supervision.",
    tags: ["policy", "housing", "complaints"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 132,
    dislikes: 8,
    comments: 45,
  },
];

const PostList = () => {
  const [posts, setPosts] = useState<typeof dummyPosts>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading posts with a delay
    const timer = setTimeout(() => {
      setPosts(dummyPosts);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg bg-card border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-4 w-32 bg-secondary animate-pulse rounded"></div>
                <div className="h-3 w-20 bg-secondary animate-pulse rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-secondary animate-pulse rounded"></div>
              <div className="h-4 w-3/4 bg-secondary animate-pulse rounded"></div>
              <div className="h-4 w-1/2 bg-secondary animate-pulse rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-secondary animate-pulse rounded"></div>
              <div className="h-6 w-16 bg-secondary animate-pulse rounded"></div>
              <div className="h-6 w-16 bg-secondary animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Posts</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          anonymousId={post.anonymousId}
          content={post.content}
          imageUrl={post.imageUrl}
          tags={post.tags}
          timestamp={post.timestamp}
          likes={post.likes}
          dislikes={post.dislikes}
          comments={post.comments}
        />
      ))}
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
        </div>
      )}
    </div>
  );
};

export default PostList;
