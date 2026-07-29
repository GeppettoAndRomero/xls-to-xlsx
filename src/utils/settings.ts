/**
 * XLS to XLSX conversion has no user-configurable settings.
 *
 * The broad record and aliases keep the stamped, unused SettingsPanel
 * type-checkable without retaining image-conversion defaults.
 */
export type ConversionSettings = Record<string, any>;
export type OutputFormat = string;
export type ResizeMode = string;

export const DEFAULT_SETTINGS: ConversionSettings = {};

export function validateSettings(_settings: ConversionSettings): {
  valid: boolean;
  errors: Record<string, string>;
} {
  return { valid: true, errors: {} };
}
