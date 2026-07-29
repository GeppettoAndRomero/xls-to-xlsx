import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, validateSettings } from '@/utils/settings';

describe('xls-to-xlsx settings', () => {
  it('has no user-configurable conversion options', () => {
    expect(DEFAULT_SETTINGS).toEqual({});
    expect(validateSettings(DEFAULT_SETTINGS)).toEqual({
      valid: true,
      errors: {},
    });
  });
});
