
import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInput = ({ tags, setTags }: TagInputProps) => {
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

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
    const trimmedInput = tagInput.trim();
    
    if (!trimmedInput) {
      return;
    }
    
    // Format tag: lowercase, replace spaces with hyphens
    const newTag = trimmedInput.toLowerCase().replace(/\s+/g, "-");
    
    // Validate tag
    if (newTag.length > 20) {
      toast({
        title: "Tag too long",
        description: "Tags must be 20 characters or less.",
        variant: "destructive",
      });
      return;
    }
    
    if (tags.includes(newTag)) {
      toast({
        title: "Tag already added",
        description: "This tag is already in your list.",
        variant: "destructive",
      });
      setTagInput("");
      return;
    }
    
    if (tags.length >= 5) {
      toast({
        title: "Maximum tags reached",
        description: "You can only add up to 5 tags per post.",
        variant: "destructive",
      });
      return;
    }
    
    // Add tag and clear input
    setTags([...tags, newTag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
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
      
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add tags (press Enter)"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
          className="bg-secondary/30"
          maxLength={20}
          disabled={tags.length >= 5}
        />
        
        <Button 
          type="button" 
          size="sm" 
          variant="secondary"
          onClick={addTag}
          disabled={!tagInput.trim() || tags.length >= 5}
        >
          Add
        </Button>
      </div>
    </>
  );
};

export default TagInput;
