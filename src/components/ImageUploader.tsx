
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onTextExtracted: (text: string) => void;
  isProcessingImage: boolean;
  setIsProcessingImage: (isProcessing: boolean) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onTextExtracted, 
  isProcessingImage,
  setIsProcessingImage
}) => {
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const clearPastedImage = () => {
    setPastedImage(null);
  };

  const mockExtractTextFromImage = async (file: File): Promise<string> => {
    // This is a mock function that simulates OCR
    // In a real app, you would use a service like Tesseract.js or an API
    setIsProcessingImage(true);
    
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock text based on file name
      const fileName = file.name?.toLowerCase() || '';
      let extractedText = "Sample text extracted from your image.";
      
      if (fileName.includes('french') || fileName.includes('france')) {
        extractedText = "Bonjour, comment ça va aujourd'hui?";
      } else if (fileName.includes('spanish') || fileName.includes('spain')) {
        extractedText = "Hola, ¿cómo estás hoy?";
      } else if (fileName.includes('german') || fileName.includes('germany')) {
        extractedText = "Hallo, wie geht es Ihnen heute?";
      }
      
      return extractedText;
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Processing image",
        description: "Extracting text from the image...",
      });
      
      // Create an image preview
      const imageUrl = URL.createObjectURL(file);
      setPastedImage(imageUrl);
      
      const extractedText = await mockExtractTextFromImage(file);
      onTextExtracted(extractedText);
      
      toast({
        title: "Text extracted",
        description: "Text has been extracted from the image.",
      });
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to extract text from the image.",
        variant: "destructive",
      });
    }
    
    // Clear the file input for future uploads
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          try {
            toast({
              title: "Processing image",
              description: "Extracting text from the pasted image...",
            });
            
            // Create an image preview
            const imageUrl = URL.createObjectURL(blob);
            setPastedImage(imageUrl);
            
            const extractedText = await mockExtractTextFromImage(blob);
            onTextExtracted(extractedText);
            
            toast({
              title: "Text extracted",
              description: "Text has been extracted from the image.",
            });
          } catch (error) {
            console.error("Error processing pasted image:", error);
            toast({
              title: "Error",
              description: "Failed to extract text from the pasted image.",
              variant: "destructive",
            });
          }
        }
        break;
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {pastedImage ? (
        <div className="relative h-full flex flex-col">
          <div className="flex-grow relative overflow-hidden border rounded-md p-2">
            <img 
              src={pastedImage} 
              alt="Pasted content" 
              className="max-w-full max-h-full object-contain mx-auto"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/70 hover:bg-white/90"
              onClick={clearPastedImage}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear image</span>
            </Button>
          </div>
        </div>
      ) : null}
      
      <Button 
        type="button" 
        variant="outline" 
        className="flex-1"
        onClick={handleImageClick}
        disabled={isProcessingImage}
      >
        <ImageIcon className="h-4 w-4 mr-2" />
        {isProcessingImage ? "Processing..." : "Upload Image"}
      </Button>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageUpload}
      />
    </>
  );
};

export default ImageUploader;
