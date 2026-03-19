import type { BaseDeps, Command } from '../../types/commands.js';

export const helpCommand: Command<BaseDeps> = {
	id: 'HELP',
	keys: [{ textKey: 'h' }],
	displayKey: 'h',
	displayText: 'help',
	helpSection: 'General',
	footer: 'priority',
	isEnabled: (deps) => deps.ui.activeOverlay === 'none',
	execute: (deps) => deps.ui.setActiveOverlay('help'),
};

export const quitCommand: Command<BaseDeps> = {
	id: 'QUIT',
	keys: [{ textKey: 'q' }],
	displayKey: 'q',
	displayText: 'quit',
	helpSection: 'General',
	footer: 'priority',
	isEnabled: (deps) => deps.ui.activeOverlay === 'none',
	execute: (deps) => deps.onQuit(),
	needsConfirmation: () => true,
	confirmMessage: 'Quit?',
};

export const scrollUpCommand: Command<BaseDeps> = {
	id: 'SCROLL_UP',
	keys: [],
	displayKey: '\u2191',
	displayText: 'scroll up',
	footer: 'hidden',
	isEnabled: () => true,
	execute: () => {},
};

export const scrollDownCommand: Command<BaseDeps> = {
	id: 'SCROLL_DOWN',
	keys: [],
	displayKey: '\u2193',
	displayText: 'scroll down',
	footer: 'hidden',
	isEnabled: () => true,
	execute: () => {},
};

export const cycleFocusCommand: Command<BaseDeps> = {
	id: 'CYCLE_FOCUS',
	keys: [],
	displayKey: 'Tab',
	displayText: 'cycle focus',
	footer: 'hidden',
	isEnabled: () => true,
	execute: () => {},
};
