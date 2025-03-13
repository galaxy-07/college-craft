
import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/moderation/ImageUpload";
import { createPost } from "@/lib/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate posts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Reset form
      setContent("");
      setTags([]);
      setImage(null);
      setImagePreview(null);
      
      toast({
        title: "Post created!",
        description: "Your anonymous post has been published.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: error.message || "An error occurred while creating your post.",
        variant: "destructive",
      });
    }
  });

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag]);
      setTagInput("");
    } else if (tags.length >= 5) {
      toast({
        title: "Maximum tags reached",
        description: "You can only add up to 5 tags per post.",
        variant: "destructive",
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageSuccess = (file: File, preview: string) => {
    setImage(file);
    setImagePreview(preview);
    setIsUploading(false);
  };

  const handleImageError = (error: string) => {
    toast({
      title: "Image upload failed",
      description: error,
      variant: "destructive",
    });
    setIsUploading(false);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Post content required",
        description: "Please write something to post.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would upload the image to storage
    // and get the URL to store in the database
    const imageUrl = imagePreview;
    
    createPostMutation.mutate({ 
      content, 
      tags, 
      imageUrl 
    });
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4">
          <Textarea
            placeholder="Share your thoughts anonymously..."
            className="resize-none min-h-24 transition-all duration-200 focus:min-h-36 mb-4 bg-secondary/30"
            value={content}
            onChange={handleContentChange}
            maxLength={500}
          />
          
          {imagePreview && (
            <div className="relative mb-4 overflow-hidden rounded-md">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto object-cover rounded-md"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 opacity-80 hover:opacity-100"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="pl-2 py-1 h-6">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              className="bg-secondary/30"
              maxLength={20}
              disabled={tags.length >= 5}
            />
            
            <ImageUpload
              onSuccess={handleImageSuccess}
              onError={handleImageError}
              onStartUpload={() => setIsUploading(true)}
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!!image || isUploading}
                className="shrink-0"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </ImageUpload>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              {content.length}/500 characters
            </p>
            <p className="text-xs text-muted-foreground">
              {tags.length}/5 tags
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 flex justify-between bg-secondary/20 border-t">
          <p className="text-sm text-muted-foreground">
            Posting anonymously to your college
          </p>
          
          <Button
            type="submit"
            disabled={createPostMutation.isPending || isUploading || !content.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Post
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreatePost;
