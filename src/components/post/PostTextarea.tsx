
import { ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";

interface PostTextareaProps {
  content: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const PostTextarea = ({ content, onChange }: PostTextareaProps) => {
  return (
    <Textarea
      placeholder="Share your thoughts anonymously..."
      className="resize-none min-h-24 transition-all duration-200 focus:min-h-36 mb-4 bg-secondary/30"
      value={content}
      onChange={onChange}
      maxLength={500}
    />
  );
};

export default PostTextarea;
