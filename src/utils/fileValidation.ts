export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_EXTENSIONS = ['.xls', '.xlsx'];
const ALLOWED_MIME_TYPES = [
  'application/vnd.ms-excel',
  'application/msexcel',
  'application/x-msexcel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const MAX_TOTAL_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export function validateFileExtension(fileName: string): ValidationResult {
  const dotIndex = fileName.lastIndexOf('.');
  const extension =
    dotIndex >= 0 ? fileName.toLowerCase().slice(dotIndex) : '';

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported extension. Supported formats: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}

export function validateFileMimeType(file: File): ValidationResult {
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported MIME type: ${file.type}`,
    };
  }

  return { valid: true };
}

export function validateFile(file: File): ValidationResult {
  // Spreadsheet MIME types are inconsistent across browsers and operating
  // systems. This tool deliberately accepts by extension.
  return validateFileExtension(file.name);
}

export function validateTotalSize(files: File[]): ValidationResult {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > MAX_TOTAL_SIZE) {
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    const maxMB = (MAX_TOTAL_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `Total file size exceeds the limit (${totalMB}MB / ${maxMB}MB)`,
    };
  }

  return { valid: true };
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[/\\?%*:|"<>]/g, '_');
}
