
import { useState, ChangeEvent, FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, uploadImage } from "@/lib/database";

export const useCreatePost = () => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async ({ content, tags, image }: { content: string, tags: string[], image: File | null }) => {
      let imageUrl = null;
      
      // If an image was selected, upload it first
      if (image) {
        imageUrl = await uploadImage(image);
        if (!imageUrl) {
          throw new Error("Failed to upload image");
        }
      }
      
      // Then create the post with the image URL
      return createPost({ content, tags, imageUrl });
    },
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
    
    createPostMutation.mutate({ 
      content, 
      tags, 
      image 
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
