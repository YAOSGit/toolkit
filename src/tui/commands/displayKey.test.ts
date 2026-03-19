import type { KeyBinding } from '../../types/commands.js';
import { getDisplayKey } from './displayKey.js';

describe('getDisplayKey', () => {
	it('displays a simple text key', () => {
		const keys: KeyBinding[] = [{ textKey: 'h' }];
		expect(getDisplayKey(keys)).toBe('h');
	});

	it('displays a text key with ctrl modifier', () => {
		const keys: KeyBinding[] = [{ textKey: 'c', ctrl: true }];
		expect(getDisplayKey(keys)).toBe('Ctrl\u00A0+\u00A0c');
	});

	it('displays a text key with shift modifier', () => {
		const keys: KeyBinding[] = [{ textKey: 'a', shift: true }];
		expect(getDisplayKey(keys)).toBe('Shift\u00A0+\u00A0a');
	});

	it('displays a text key with meta modifier', () => {
		const keys: KeyBinding[] = [{ textKey: 'x', meta: true }];
		const modKey = process.platform === 'darwin' ? 'Cmd' : 'Alt';
		expect(getDisplayKey(keys)).toBe(`${modKey}\u00A0+\u00A0x`);
	});

	it('displays multiple modifiers', () => {
		const keys: KeyBinding[] = [{ textKey: 'k', ctrl: true, shift: true }];
		expect(getDisplayKey(keys)).toBe('Ctrl\u00A0+\u00A0Shift\u00A0+\u00A0k');
	});

	it('displays specialKey return as arrow symbol', () => {
		const keys: KeyBinding[] = [{ specialKey: 'return' }];
		expect(getDisplayKey(keys)).toBe('\u21B5');
	});

	it('displays specialKey tab', () => {
		const keys: KeyBinding[] = [{ specialKey: 'tab' }];
		expect(getDisplayKey(keys)).toBe('Tab');
	});

	it('displays specialKey escape', () => {
		const keys: KeyBinding[] = [{ specialKey: 'escape' }];
		expect(getDisplayKey(keys)).toBe('Esc');
	});

	it('displays specialKey backspace', () => {
		const keys: KeyBinding[] = [{ specialKey: 'backspace' }];
		expect(getDisplayKey(keys)).toBe('\u232B');
	});

	it('displays specialKey delete', () => {
		const keys: KeyBinding[] = [{ specialKey: 'delete' }];
		expect(getDisplayKey(keys)).toBe('Del');
	});

	it('displays specialKey upArrow', () => {
		const keys: KeyBinding[] = [{ specialKey: 'upArrow' }];
		expect(getDisplayKey(keys)).toBe('\u2191');
	});

	it('displays specialKey downArrow', () => {
		const keys: KeyBinding[] = [{ specialKey: 'downArrow' }];
		expect(getDisplayKey(keys)).toBe('\u2193');
	});

	it('displays leftArrow binding', () => {
		const keys: KeyBinding[] = [{ leftArrow: true }];
		expect(getDisplayKey(keys)).toBe('\u2190');
	});

	it('displays rightArrow binding', () => {
		const keys: KeyBinding[] = [{ rightArrow: true }];
		expect(getDisplayKey(keys)).toBe('\u2192');
	});

	it('displays modifier with specialKey', () => {
		const keys: KeyBinding[] = [{ specialKey: 'tab', shift: true }];
		expect(getDisplayKey(keys)).toBe('Shift\u00A0+\u00A0Tab');
	});

	it('joins multiple bindings with " / "', () => {
		const keys: KeyBinding[] = [{ textKey: 'h' }, { textKey: '?' }];
		expect(getDisplayKey(keys)).toBe('h / ?');
	});

	it('joins multiple complex bindings with " / "', () => {
		const keys: KeyBinding[] = [{ specialKey: 'return' }, { textKey: 'e' }];
		expect(getDisplayKey(keys)).toBe('\u21B5 / e');
	});

	it('returns empty string for empty bindings', () => {
		expect(getDisplayKey([])).toBe('');
	});
});
