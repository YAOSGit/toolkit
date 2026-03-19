import type { Key } from 'ink';
import type { KeyBinding } from '../../types/commands.js';
import { isKeyMatch } from './keyMatch.js';

const emptyKey: Key = {
	upArrow: false,
	downArrow: false,
	leftArrow: false,
	rightArrow: false,
	pageDown: false,
	pageUp: false,
	home: false,
	end: false,
	return: false,
	escape: false,
	ctrl: false,
	shift: false,
	tab: false,
	backspace: false,
	delete: false,
	meta: false,
	super: false,
	hyper: false,
	capsLock: false,
	numLock: false,
};

describe('isKeyMatch', () => {
	it('matches a simple text key', () => {
		const bindings: KeyBinding[] = [{ textKey: 'h' }];
		expect(isKeyMatch({ ...emptyKey }, 'h', bindings)).toBe(true);
	});

	it('matches text key case-insensitively', () => {
		const bindings: KeyBinding[] = [{ textKey: 'H' }];
		expect(isKeyMatch({ ...emptyKey }, 'h', bindings)).toBe(true);
	});

	it('rejects non-matching text key', () => {
		const bindings: KeyBinding[] = [{ textKey: 'h' }];
		expect(isKeyMatch({ ...emptyKey }, 'q', bindings)).toBe(false);
	});

	it('matches ctrl modifier', () => {
		const bindings: KeyBinding[] = [{ textKey: 'c', ctrl: true }];
		expect(isKeyMatch({ ...emptyKey, ctrl: true }, 'c', bindings)).toBe(true);
	});

	it('rejects when ctrl modifier is required but missing', () => {
		const bindings: KeyBinding[] = [{ textKey: 'c', ctrl: true }];
		expect(isKeyMatch({ ...emptyKey, ctrl: false }, 'c', bindings)).toBe(false);
	});

	it('matches shift modifier', () => {
		const bindings: KeyBinding[] = [{ textKey: 'a', shift: true }];
		expect(isKeyMatch({ ...emptyKey, shift: true }, 'a', bindings)).toBe(true);
	});

	it('rejects when shift modifier is required but missing', () => {
		const bindings: KeyBinding[] = [{ textKey: 'a', shift: true }];
		expect(isKeyMatch({ ...emptyKey, shift: false }, 'a', bindings)).toBe(
			false,
		);
	});

	it('matches meta modifier', () => {
		const bindings: KeyBinding[] = [{ textKey: 'x', meta: true }];
		expect(isKeyMatch({ ...emptyKey, meta: true }, 'x', bindings)).toBe(true);
	});

	it('rejects when meta modifier is required but missing', () => {
		const bindings: KeyBinding[] = [{ textKey: 'x', meta: true }];
		expect(isKeyMatch({ ...emptyKey, meta: false }, 'x', bindings)).toBe(false);
	});

	it('matches leftArrow binding', () => {
		const bindings: KeyBinding[] = [{ leftArrow: true }];
		expect(isKeyMatch({ ...emptyKey, leftArrow: true }, '', bindings)).toBe(
			true,
		);
	});

	it('rejects leftArrow when not pressed', () => {
		const bindings: KeyBinding[] = [{ leftArrow: true }];
		expect(isKeyMatch({ ...emptyKey, leftArrow: false }, '', bindings)).toBe(
			false,
		);
	});

	it('matches rightArrow binding', () => {
		const bindings: KeyBinding[] = [{ rightArrow: true }];
		expect(isKeyMatch({ ...emptyKey, rightArrow: true }, '', bindings)).toBe(
			true,
		);
	});

	it('matches specialKey return', () => {
		const bindings: KeyBinding[] = [{ specialKey: 'return' }];
		expect(isKeyMatch({ ...emptyKey, return: true }, '', bindings)).toBe(true);
	});

	it('matches specialKey tab', () => {
		const bindings: KeyBinding[] = [{ specialKey: 'tab' }];
		expect(isKeyMatch({ ...emptyKey, tab: true }, '', bindings)).toBe(true);
	});

	it('matches specialKey escape', () => {
		const bindings: KeyBinding[] = [{ specialKey: 'escape' }];
		expect(isKeyMatch({ ...emptyKey, escape: true }, '', bindings)).toBe(true);
	});

	it('matches specialKey backspace', () => {
		const bindings: KeyBinding[] = [{ specialKey: 'backspace' }];
		expect(isKeyMatch({ ...emptyKey, backspace: true }, '', bindings)).toBe(
			true,
		);
	});

	it('matches specialKey delete', () => {
		const bindings: KeyBinding[] = [{ specialKey: 'delete' }];
		expect(isKeyMatch({ ...emptyKey, delete: true }, '', bindings)).toBe(true);
	});

	it('matches specialKey upArrow', () => {
		const bindings: KeyBinding[] = [{ specialKey: 'upArrow' }];
		expect(isKeyMatch({ ...emptyKey, upArrow: true }, '', bindings)).toBe(true);
	});

	it('matches specialKey downArrow', () => {
		const bindings: KeyBinding[] = [{ specialKey: 'downArrow' }];
		expect(isKeyMatch({ ...emptyKey, downArrow: true }, '', bindings)).toBe(
			true,
		);
	});

	it('matches with multiple bindings (first matches)', () => {
		const bindings: KeyBinding[] = [{ textKey: 'h' }, { textKey: 'q' }];
		expect(isKeyMatch({ ...emptyKey }, 'h', bindings)).toBe(true);
	});

	it('matches with multiple bindings (second matches)', () => {
		const bindings: KeyBinding[] = [{ textKey: 'h' }, { textKey: 'q' }];
		expect(isKeyMatch({ ...emptyKey }, 'q', bindings)).toBe(true);
	});

	it('rejects when no bindings match', () => {
		const bindings: KeyBinding[] = [{ textKey: 'h' }, { textKey: 'q' }];
		expect(isKeyMatch({ ...emptyKey }, 'z', bindings)).toBe(false);
	});

	it('returns false for empty bindings array', () => {
		expect(isKeyMatch({ ...emptyKey }, 'h', [])).toBe(false);
	});

	it('matches shift+leftArrow', () => {
		const bindings: KeyBinding[] = [{ leftArrow: true, shift: true }];
		expect(
			isKeyMatch({ ...emptyKey, leftArrow: true, shift: true }, '', bindings),
		).toBe(true);
	});

	it('rejects shift+leftArrow when shift not pressed', () => {
		const bindings: KeyBinding[] = [{ leftArrow: true, shift: true }];
		expect(
			isKeyMatch({ ...emptyKey, leftArrow: true, shift: false }, '', bindings),
		).toBe(false);
	});
});
