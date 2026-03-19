import type { OverlayState } from './overlay.js';

export type KeyBinding = {
	textKey?: string;
	specialKey?: string;
	leftArrow?: boolean;
	rightArrow?: boolean;
	ctrl?: boolean;
	shift?: boolean;
	meta?: boolean;
};

export type BaseDeps = {
	ui: OverlayState & {
		cycleFocus: () => void;
	};
	onQuit: () => void;
};

export type Command<TDeps extends BaseDeps = BaseDeps> = {
	id: string;
	keys: KeyBinding[];
	displayKey: string;
	displayText: string;
	helpSection?: string;
	helpLabel?: string;
	footer?: 'priority' | 'optional' | 'hidden';
	footerOrder?: number;
	isEnabled: (deps: TDeps) => boolean;
	execute: (deps: TDeps) => void;
	needsConfirmation?: (deps: TDeps) => boolean;
	confirmMessage?: string | ((deps: TDeps) => string);
};
