
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PostCard from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import FilterPanel from "./FilterPanel";
import { getPosts } from "@/lib/database";
import { useQuery } from "@tanstack/react-query";

// Extract all unique tags - we'll get this from the fetched posts
const allAvailableTags: string[] = [];

const PostList = () => {
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // Get search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Fetch posts from database
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', searchQuery, selectedTags],
    queryFn: () => getPosts({ 
      tags: selectedTags, 
      searchQuery 
    }),
    refetchOnWindowFocus: true,
  });

  // Extract all unique tags from posts when posts change
  useEffect(() => {
    if (posts && posts.length > 0) {
      const uniqueTags = [...new Set(posts.flatMap((post: any) => post.tags))];
      setAllTags(uniqueTags);
    }
  }, [posts]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
    
    // Remove query param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  };

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
        <h2 className="text-2xl font-semibold tracking-tight">
          {searchQuery 
            ? `Search results for "${searchQuery}"` 
            : selectedTags.length > 0 
              ? "Filtered Posts" 
              : "Recent Posts"
          }
        </h2>
        <div className="flex items-center gap-2">
          {(searchQuery || selectedTags.length > 0) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="gap-1.5"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            size="sm" 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <FilterPanel 
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearFilters={() => setSelectedTags([])}
          allTags={allTags}
        />
      )}
      
      {posts.length > 0 ? (
        posts.map((post: any) => (
          <PostCard
            key={post.id}
            id={post.id}
            anonymousId={post.anonymous_id}
            content={post.content}
            imageUrl={post.image_url}
            tags={post.tags}
            timestamp={new Date(post.created_at)}
            likes={post.likes || 0}
            dislikes={post.dislikes || 0}
            comments={post.comments || 0}
            onTagClick={handleTagToggle}
          />
        ))
      ) : (
        <div className="text-center py-12 bg-card/50 rounded-lg border">
          <p className="text-muted-foreground">No posts match your filters. Try different search terms or tags.</p>
          <Button 
            variant="link" 
            onClick={clearFilters}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostList;
