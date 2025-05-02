
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExtractedTextDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  extractedText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExtractedTextDialog: React.FC<ExtractedTextDialogProps> = ({
  isOpen,
  onOpenChange,
  extractedText,
  onConfirm,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Extracted Text</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">The following text was extracted from your image:</p>
          <div className="border p-3 rounded-md bg-slate-50">
            <p className="text-md">{extractedText}</p>
          </div>
          <div className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Use this text
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExtractedTextDialog;
