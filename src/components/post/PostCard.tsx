import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flag, MessageSquare, MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { updatePostEngagement } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import CommentsSection from "./CommentsSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  id: string;
  anonymousId: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  timestamp: Date;
  likes: number;
  dislikes: number;
  comments: number;
  userLiked?: boolean;
  userDisliked?: boolean;
  onTagClick?: (tag: string) => void;
}

const PostCard = ({
  id,
  anonymousId,
  content,
  imageUrl,
  tags,
  timestamp,
  likes,
  dislikes,
  comments,
  userLiked = false,
  userDisliked = false,
  onTagClick,
}: PostCardProps) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [commentCount, setCommentCount] = useState(comments);
  const [isLiked, setIsLiked] = useState(userLiked);
  const [isDisliked, setIsDisliked] = useState(userDisliked);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    try {
      if (isLiked) {
        // Unlike
        const newCount = likeCount - 1;
        setLikeCount(newCount);
        setIsLiked(false);
        await updatePostEngagement(id, 'likes', newCount);
      } else {
        // Like
        const newCount = likeCount + 1;
        setLikeCount(newCount);
        setIsLiked(true);
        await updatePostEngagement(id, 'likes', newCount);
        
        // If it was disliked, remove dislike
        if (isDisliked) {
          const newDislikeCount = dislikeCount - 1;
          setDislikeCount(newDislikeCount);
          setIsDisliked(false);
          await updatePostEngagement(id, 'dislikes', newDislikeCount);
        }
      }
    } catch (error) {
      toast({
        title: "Error updating like",
        description: "There was a problem saving your reaction.",
        variant: "destructive",
      });
      // Revert state on error
      setLikeCount(likes);
      setIsLiked(userLiked);
    }
  };

  const handleDislike = async () => {
    try {
      if (isDisliked) {
        // Remove dislike
        const newCount = dislikeCount - 1;
        setDislikeCount(newCount);
        setIsDisliked(false);
        await updatePostEngagement(id, 'dislikes', newCount);
      } else {
        // Dislike
        const newCount = dislikeCount + 1;
        setDislikeCount(newCount);
        setIsDisliked(true);
        await updatePostEngagement(id, 'dislikes', newCount);
        
        // If it was liked, remove like
        if (isLiked) {
          const newLikeCount = likeCount - 1;
          setLikeCount(newLikeCount);
          setIsLiked(false);
          await updatePostEngagement(id, 'likes', newLikeCount);
        }
      }
    } catch (error) {
      toast({
        title: "Error updating dislike",
        description: "There was a problem saving your reaction.",
        variant: "destructive",
      });
      // Revert state on error
      setDislikeCount(dislikes);
      setIsDisliked(userDisliked);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes";
    
    return Math.floor(seconds) + " seconds";
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Update comment count when it changes
  useEffect(() => {
    setCommentCount(comments);
  }, [comments]);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md mb-4">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <div className="bg-secondary flex items-center justify-center h-full w-full">
                <span className="text-xs font-medium">#{anonymousId.substring(0, 4)}</span>
              </div>
            </Avatar>
            <div>
              <div className="text-sm font-medium">Anonymous #{anonymousId.substring(0, 4)}</div>
              <div className="text-xs text-muted-foreground">{formatTimeAgo(timestamp)} ago</div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Flag className="h-4 w-4 mr-2" />
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-2">
        <p className="text-sm whitespace-pre-line mb-3">{content}</p>
        
        {imageUrl && (
          <div className="relative overflow-hidden rounded-md mb-3">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-secondary animate-pulse rounded-md" />
            )}
            <img
              src={imageUrl}
              alt="Post content"
              className={cn(
                "w-full h-auto object-cover rounded-md transition-opacity duration-200",
                !isImageLoaded && "opacity-0"
              )}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
        )}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  onTagClick && "cursor-pointer hover:bg-secondary"
                )}
                onClick={() => onTagClick && onTagClick(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-2 flex flex-col">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1 h-8 px-2",
                isLiked && "text-primary"
              )}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="text-xs">{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1 h-8 px-2",
                isDisliked && "text-destructive"
              )}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="text-xs">{dislikeCount}</span>
            </Button>
            
            <Collapsible open={showComments} onOpenChange={setShowComments} className="w-full">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 h-8 px-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">{commentCount}</span>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2">
                <CommentsSection postId={id} onCommentAdded={() => setCommentCount(prev => prev + 1)} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
