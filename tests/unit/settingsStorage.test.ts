// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { loadSettings, saveSettings } from '@/utils/settingsStorage';
import { DEFAULT_SETTINGS } from '@/utils/settings';

describe('settingsStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns the defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips saved settings', () => {
    saveSettings(DEFAULT_SETTINGS);
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('merges a stored partial over the defaults', () => {
    localStorage.setItem(
      'xls-to-xlsx-settings',
      JSON.stringify({ futureOption: true })
    );
    const loaded = loadSettings();
    expect(loaded).toEqual({ futureOption: true });
  });

  it('falls back to the defaults on malformed JSON', () => {
    localStorage.setItem('xls-to-xlsx-settings', '{not valid json');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
