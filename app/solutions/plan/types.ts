/**
 * Типы данных для страницы Plan
 */

export interface ChatMessage {
  type: "user" | "system" | "question" | "ai_response";
  text: string;
  options?: string[];
  files?: string[];
  multiple?: boolean;
  reaction?: string;
}

export interface Analytics {
  completeness: string;
  business_stage_insights: string;
  market_potential: string;
  risks: string[];
  recommendations: string[];
  missing_critical_info: string[];
}

export interface AnswerData {
  answer: string | string[];
  confidence?: string;
  files: string[];
}

export const ALLOWED_FILE_TYPES = [
  "doc",
  "docx",
  "xls",
  "xlsx",
  "txt",
  "pdf",
  "png",
  "jpg",
  "jpeg",
];

export const MAX_FILES = 5;
export const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10 MB

export const REACTIONS = ["👍", "❤️", "😊", "🤔", "💡", "🎉", "🔥"];

export const LANGUAGES = [
  { code: "ru", name: "🇷🇺 Русский" },
  { code: "en", name: "🇬🇧 English" },
  { code: "es", name: "🇪🇸 Español" },
  { code: "fr", name: "🇫🇷 Français" },
  { code: "de", name: "🇩🇪 Deutsch" },
  { code: "zh", name: "🇨🇳 中文" },
];