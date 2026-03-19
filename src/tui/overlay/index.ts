import { useCallback, useState } from 'react';
import type { OverlayState, PendingConfirmation } from '../../types/overlay.js';

export function useOverlayState<T extends string>(): OverlayState<T> {
	const [activeOverlay, setActiveOverlay] = useState<T | 'none'>(
		'none' as T | 'none',
	);
	const [confirmation, setConfirmation] = useState<PendingConfirmation | null>(
		null,
	);

	const requestConfirmation = useCallback(
		(message: string, onConfirm: () => void) => {
			setConfirmation({ message, onConfirm });
		},
		[],
	);

	const clearConfirmation = useCallback(() => {
		setConfirmation(null);
	}, []);

	return {
		activeOverlay,
		setActiveOverlay,
		confirmation,
		requestConfirmation,
		clearConfirmation,
	};
}
