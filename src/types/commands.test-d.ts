import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { BaseDeps, Command, KeyBinding } from './commands.js';
import type { OverlayState } from './overlay.js';

describe('KeyBinding', () => {
	it('accepts text key', () => {
		assertType<KeyBinding>({ textKey: 'h' });
	});

	it('accepts modifiers', () => {
		assertType<KeyBinding>({ textKey: 'e', ctrl: true });
	});

	it('accepts arrow keys', () => {
		assertType<KeyBinding>({ leftArrow: true, shift: true });
	});
});

describe('BaseDeps', () => {
	it('ui composes OverlayState', () => {
		expectTypeOf<BaseDeps['ui']>().toMatchTypeOf<OverlayState>();
	});
});

describe('Command', () => {
	it('defaults TDeps to BaseDeps', () => {
		const cmd: Command = {
			id: 'TEST',
			keys: [{ textKey: 't' }],
			displayKey: 't',
			displayText: 'test',
			isEnabled: (deps) => deps.ui.activeOverlay === 'none',
			execute: (deps) => deps.onQuit(),
		};
		assertType<Command>(cmd);
	});

	it('accepts extended deps', () => {
		type MyDeps = BaseDeps & { custom: string };
		const cmd: Command<MyDeps> = {
			id: 'CUSTOM',
			keys: [],
			displayKey: 'c',
			displayText: 'custom',
			isEnabled: (deps) => deps.custom === 'yes',
			execute: () => {},
		};
		assertType<Command<MyDeps>>(cmd);
	});
});
