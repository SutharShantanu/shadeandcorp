"use client";

import { useState, useCallback } from "react";
import { Upload, Check, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPicture?: string;
  onSelect: (imageUrl: string) => void;
  displayName: string;
}

// Sample profile pictures
const SAMPLE_AVATARS = [
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Felix",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucy",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Max",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Milo",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Sophie",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Oliver",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Emma",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Charlie",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Luna",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Leo",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Bella",
];

export default function ProfilePictureModal({
  isOpen,
  onClose,
  currentPicture,
  onSelect,
  displayName,
}: ProfilePictureModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentPicture || null,
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please drop an image file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedImage !== null) {
      onSelect(selectedImage);
      toast.success(
        selectedImage ? "Profile picture updated" : "Profile picture removed",
      );
      onClose();
    }
  };

  const handleRemove = () => {
    setSelectedImage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Choose from sample avatars or upload your own image.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 w-full flex items-center gap-2 p-4">
          {/* Current Selection Preview */}
          <div className="flex flex-col w-1/2 items-center gap-3">
            <Avatar className="size-24">
              <AvatarImage src={selectedImage || ""} alt={displayName} />
              <AvatarFallback className="text-2xl">
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">Current selection</p>
            {selectedImage && (
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={handleRemove}
              >
                <Trash2 />
              </Button>
            )}
          </div>

          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 w-1/2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            <input
              type="file"
              id="picture-upload"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">
              Drag and drop your image here
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              or click to browse from your device
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("picture-upload")?.click()}
            >
              Choose File
            </Button>
          </div>

          {/* Sample Avatars */}
        </div>
        <Separator />
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3">Sample Avatars</h4>
          <div className="grid grid-cols-6 gap-3">
            {SAMPLE_AVATARS.map((avatar, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(avatar)}
                className={`relative rounded-full transition-all size-16 ${
                  selectedImage === avatar
                    ? "ring-2 ring-primary ring-offset-2"
                    : "hover:ring-2 hover:ring-muted-foreground/25"
                }`}
              >
                <Avatar className="size-16">
                  <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                  <AvatarFallback>{index + 1}</AvatarFallback>
                </Avatar>
                {selectedImage === avatar && (
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="size-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedImage === null}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
