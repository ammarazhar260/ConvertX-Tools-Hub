import { ReactNode } from "react";

/**
 * Represents a tool in the application
 */
export interface Tool {
  /** Unique identifier for the tool */
  id: string;
  /** Display name of the tool */
  title: string;
  /** Detailed description of the tool's functionality */
  description: string;
  /** React component for the tool's icon */
  icon: ReactNode;
  /** Category the tool belongs to */
  category: string;
  /** Current status of the tool */
  status?: "active" | "disabled" | "beta";
  /** Implementation details or configuration */
  implementation?: string;
}

/**
 * Available icon types for tools
 */
export type IconType = 
  | "FileText" 
  | "File"
  | "ImageIcon" 
  | "Zap" 
  | "FileCode" 
  | "Calculator" 
  | "Wand2" 
  | "VolumeIcon" 
  | "ClipboardCopy";

/**
 * Tool status options
 */
export type ToolStatus = "active" | "disabled" | "beta";

/**
 * Tool category options
 */
export type ToolCategory = 
  | "text"
  | "image"
  | "audio"
  | "video"
  | "code"
  | "utility"
  | "other";
