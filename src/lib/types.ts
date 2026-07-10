/** Shared TypeScript types for Payload CMS documents consumed by the Astro app. */

export type LexicalNode = {
  type?: string;
  tag?: string | number;
  text?: string;
  format?: number | string;
  listType?: "bullet" | "number" | "check";
  url?: string;
  fields?: { url?: string; linkType?: string; newTab?: boolean; doc?: unknown };
  value?: { url?: string; alt?: string; width?: number; height?: number } | string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

export type LexicalContent = { root: LexicalNode };

export interface Media {
  id: string | number;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Page {
  id: string | number;
  title: string;
  slug: string;
  content: LexicalContent;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  featuredImage?: Media | string | number | null;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Update extends Page {
  category?: string | null;
}

export interface Lead {
  id?: string | number;
  name: string;
  email?: string;
  phone?: string;
  serviceNeeded?: string[];
  projectAddress?: string;
  city?: string;
  county?: string;
  message: string;
  preferredContactMethod?: string;
  sourcePage?: string;
  status?: "new" | "contacted" | "resolved";
  consent: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface ChatMessage {
  sender: "user" | "bot" | "admin" | "system";
  text: string;
  timestamp: string;
}

export interface Chat {
  id?: string | number;
  sessionId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  serviceNeeded?: string;
  status?: "open" | "submitted" | "reviewed" | "closed";
  messages: ChatMessage[];
  lead?: string | number | null;
  sourcePage?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type SecurityEventType =
  | "auth_failure"
  | "api_error"
  | "brute_force_suspect"
  | "validation_error"
  | "suspicious_submission"
  | "rate_limit"
  | "smtp_error"
  | "smtp_test_failed"
  | "smtp_test_success"
  | "email_send_failed";

export interface SecurityLog {
  eventType: SecurityEventType;
  ipAddress?: string;
  userAgent?: string;
  route?: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

export interface SMTPSettings {
  enabled: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  /** AES-256-GCM ciphertext ("iv:authTag:ciphertext" hex) — never plaintext. */
  smtpPasswordEncrypted?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  leadNotifyEmail?: string;
  replyToEmail?: string;
  testRecipientEmail?: string;
  lastTestStatus?: string;
  lastTestedAt?: string;
}
