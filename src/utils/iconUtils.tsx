import React from "react";
import { FileText, ImageIcon, Zap, FileCode, Calculator, Wand2, VolumeIcon, ClipboardCopy, File } from "lucide-react";
import { IconType } from "@/types/tool";

// Helper function to get icon component by name
export const getIconComponent = (iconType: IconType) => {
  switch (iconType) {
    case "FileText":
      return <FileText className="h-5 w-5" />;
    case "ImageIcon":
      return <ImageIcon className="h-5 w-5" />;
    case "Zap":
      return <Zap className="h-5 w-5" />;
    case "FileCode":
      return <FileCode className="h-5 w-5" />;
    case "Calculator":
      return <Calculator className="h-5 w-5" />;
    case "Wand2":
      return <Wand2 className="h-5 w-5" />;
    case "VolumeIcon":
      return <VolumeIcon className="h-5 w-5" />;
    case "ClipboardCopy":
      return <ClipboardCopy className="h-5 w-5" />;
    case "File":
      return <File className="h-5 w-5" />;
    default:
      return <Wand2 className="h-5 w-5" />;
  }
};

// Extract icon type from a React component
export const getIconTypeFromComponent = (icon: React.ReactNode): IconType => {
  if (icon && typeof icon === "object") {
    const iconString = (icon as JSX.Element).type.toString();
    const matches = iconString.match(/function\s+(\w+)/);
    if (matches && matches[1]) {
      return matches[1] as IconType;
    }
  }
  return "Wand2";
};
