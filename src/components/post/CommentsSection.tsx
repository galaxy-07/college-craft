
import { useState, useEffect } from "react";
import { getComments, createComment } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, CornerDownRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the comment interface
interface Comment {
  id: string;
  post_id: string;
  content: string;
  anonymous_id: string;
  parent_id: string | null;
  created_at: string;
}

interface CommentsSectionProps {
  postId: string;
  onCommentAdded: () => void;
}

const CommentsSection = ({ postId, onCommentAdded }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const { toast } = useToast();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const data = await getComments(postId);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast({
          title: "Error loading comments",
          variant: "destructive",
        });
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [postId, toast]);

  // Submit a comment
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const comment = await createComment({
        postId,
        content: newComment,
        parentId: replyTo,
      });
      
      setComments([...comments, comment]);
      setNewComment("");
      setReplyTo(null);
      onCommentAdded();
      
      toast({
        title: "Comment posted",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error posting comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Organize comments into a hierarchical structure
  const organizeThreads = (commentList: Comment[]) => {
    const topLevelComments = commentList.filter(comment => !comment.parent_id);
    
    const renderComment = (comment: Comment, level = 0) => {
      const childComments = commentList.filter(c => c.parent_id === comment.id);
      
      return (
        <div 
          key={comment.id} 
          className={`pt-3 ${level > 0 ? `ml-${Math.min(level * 4, 12)}` : ''}`}
        >
          <div className="flex items-start gap-2">
            {level > 0 && (
              <CornerDownRight className="h-4 w-4 text-muted-foreground mt-1 mr-1" />
            )}
            <Avatar className="h-6 w-6 mt-1">
              <div className="bg-secondary flex items-center justify-center h-full w-full">
                <span className="text-xs font-medium">#{comment.anonymous_id.substring(0, 2)}</span>
              </div>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  Anonymous #{comment.anonymous_id.substring(0, 4)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(comment.created_at)}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs mt-1"
                onClick={() => setReplyTo(comment.id)}
              >
                Reply
              </Button>
            </div>
          </div>
          
          {childComments.map(child => renderComment(child, level + 1))}
        </div>
      );
    };
    
    return topLevelComments.map(comment => renderComment(comment));
  };

  return (
    <div className="space-y-4 bg-secondary/20 rounded-md p-4 mt-2">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-4 w-4" />
        <h3 className="text-sm font-medium">Comments</h3>
      </div>
      
      {loadingComments ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {organizeThreads(comments)}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t">
        {replyTo && (
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <span>Replying to comment</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 px-1 text-xs"
              onClick={() => setReplyTo(null)}
            >
              Cancel
            </Button>
          </div>
        )}
        
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-20 resize-none mb-2"
        />
        
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleSubmitComment}
            disabled={loading || !newComment.trim()}
          >
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
