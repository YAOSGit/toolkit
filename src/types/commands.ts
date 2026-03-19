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

export type BaseDeps<T extends string = string> = {
	ui: OverlayState<T> & {
		cycleFocus: () => void;
	};
	onQuit: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Command<TDeps extends BaseDeps<any> = BaseDeps> = {
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
