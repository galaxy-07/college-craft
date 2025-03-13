
import { FormEvent } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Send } from "lucide-react";
import ImageUpload from "@/components/moderation/ImageUpload";
import PostTextarea from "./PostTextarea";
import TagInput from "./TagInput";
import ImagePreview from "./ImagePreview";
import { useCreatePost } from "@/hooks/use-create-post";

const CreatePost = () => {
  const {
    content,
    tags,
    setTags,
    imagePreview,
    isUploading,
    setIsUploading,
    handleContentChange,
    handleImageSuccess,
    handleImageError,
    removeImage,
    handleSubmit,
    isPending
  } = useCreatePost();

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4">
          <PostTextarea 
            content={content} 
            onChange={handleContentChange} 
          />
          
          <ImagePreview 
            imagePreview={imagePreview} 
            removeImage={removeImage} 
          />
          
          <div className="flex gap-2">
            <TagInput tags={tags} setTags={setTags} />
            
            <ImageUpload
              onSuccess={handleImageSuccess}
              onError={handleImageError}
              onStartUpload={() => setIsUploading(true)}
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!!imagePreview || isUploading}
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
            disabled={isPending || isUploading || !content.trim()}
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
