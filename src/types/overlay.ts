export type PendingConfirmation = {
	message: string;
	onConfirm: () => void;
};

export type OverlayState<T extends string = string> = {
	activeOverlay: T | 'none';
	setActiveOverlay: (overlay: T | 'none') => void;
	confirmation: PendingConfirmation | null;
	requestConfirmation: (message: string, onConfirm: () => void) => void;
	clearConfirmation: () => void;
};
