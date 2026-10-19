import { FileCategory } from '@/types';

export const ALLOWED_MIME_TYPES: Record<string, FileCategory> = {
  // Presentations
  'application/vnd.ms-powerpoint': 'presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'presentation',
  // Documents
  'application/pdf': 'document',
  'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
  'text/plain': 'document',
  'text/markdown': 'document',
  // Images
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/svg+xml': 'image',
  'image/webp': 'image',
  'image/gif': 'image',
  // Code
  'application/json': 'code',
  'text/javascript': 'code',
  'text/typescript': 'code',
  'text/x-python': 'code',
  // Archives
  'application/zip': 'archive',
  'application/x-zip-compressed': 'archive',
  'application/x-tar': 'archive',
  'application/gzip': 'archive',
};

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function detectFileCategory(fileName: string, mimeType?: string): FileCategory {
  if (mimeType && ALLOWED_MIME_TYPES[mimeType]) {
    return ALLOWED_MIME_TYPES[mimeType];
  }

  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ppt':
    case 'pptx':
    case 'key':
      return 'presentation';
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
    case 'md':
      return 'document';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
    case 'svg':
      return 'image';
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
    case 'py':
    case 'json':
    case 'rs':
    case 'go':
    case 'cpp':
    case 'c':
      return 'code';
    case 'zip':
    case 'tar':
    case 'gz':
    case 'rar':
      return 'archive';
    default:
      return 'other';
  }
}

export function isFilePreviewable(category: FileCategory, mimeType?: string): boolean {
  if (category === 'image' || category === 'code') return true;
  if (mimeType === 'application/pdf') return true;
  return false;
}
