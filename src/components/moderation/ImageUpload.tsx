
import { useState, ReactNode, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  children: ReactNode;
  onSuccess: (file: File, preview: string) => void;
  onError: (error: string) => void;
  onStartUpload: () => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const ImageUpload = ({
  children,
  onSuccess,
  onError,
  onStartUpload,
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/gif"],
}: ImageUploadProps) => {
  const [inputKey, setInputKey] = useState(Date.now());

  const resetInput = () => {
    setInputKey(Date.now());
  };

  const validateImage = (file: File): boolean => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError(`File size exceeds maximum limit of ${maxSizeMB}MB`);
      resetInput();
      return false;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      onError("File type not supported. Please upload a valid image file.");
      resetInput();
      return false;
    }

    return true;
  };

  // Simulated content moderation check (in a real app, this would be a server API call)
  const checkImageContent = (file: File): Promise<{ safe: boolean; score: number }> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // For demo purposes, we'll randomly flag ~10% of images as unsafe
        const randomScore = Math.random();
        const isSafe = randomScore < 0.9; // 90% pass rate
        
        resolve({
          safe: isSafe,
          score: randomScore,
        });
      }, 800);
    });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate image
    if (!validateImage(file)) return;
    
    onStartUpload();
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Check image content using ML model
      const moderationResult = await checkImageContent(file);
      
      if (moderationResult.safe) {
        onSuccess(file, previewUrl);
      } else {
        URL.revokeObjectURL(previewUrl);
        onError(
          "This image may contain inappropriate content and cannot be uploaded. Please select another image."
        );
        resetInput();
      }
    } catch (error) {
      onError("An error occurred while processing the image. Please try again.");
      resetInput();
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleImageChange}
        className="hidden"
        id={`image-upload-${inputKey}`}
        key={inputKey}
      />
      <label htmlFor={`image-upload-${inputKey}`}>
        {children}
      </label>
    </div>
  );
};

export default ImageUpload;
