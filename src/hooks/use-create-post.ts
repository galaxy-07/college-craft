
import { useState, ChangeEvent, FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/lib/database";

export const useCreatePost = () => {
  const [content, setContent] = useState("");
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

  return {
    content,
    setContent,
    tags,
    setTags,
    image,
    imagePreview,
    isUploading,
    setIsUploading,
    handleContentChange,
    handleImageSuccess,
    handleImageError,
    removeImage,
    handleSubmit,
    isPending: createPostMutation.isPending
  };
};
