
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  imagePreview: string | null;
  removeImage: () => void;
}

const ImagePreview = ({ imagePreview, removeImage }: ImagePreviewProps) => {
  if (!imagePreview) return null;
  
  return (
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
  );
};

export default ImagePreview;
