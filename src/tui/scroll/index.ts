import { useCallback, useEffect, useState } from 'react';
import type { ScrollState } from '../../types/scroll.js';

export function useScrollState(options?: {
	totalLines?: number;
	viewHeight?: number;
	autoScroll?: boolean;
}): ScrollState {
	const [offset, setOffsetRaw] = useState(0);
	const [autoScroll, setAutoScroll] = useState(options?.autoScroll ?? false);

	const maxOffset = Math.max(
		0,
		(options?.totalLines ?? 0) - (options?.viewHeight ?? 0),
	);

	const clamp = useCallback(
		(val: number) => Math.max(0, Math.min(val, maxOffset)),
		[maxOffset],
	);

	const setOffset = useCallback(
		(val: number) => {
			setOffsetRaw(clamp(val));
			setAutoScroll(false); // manual scroll disengages auto-scroll
		},
		[clamp],
	);

	const scrollBy = useCallback(
		(delta: number) => {
			setOffsetRaw((prev) => {
				const next = clamp(prev + delta);
				if (delta < 0) setAutoScroll(false); // scrolling up disengages
				if (next >= maxOffset) setAutoScroll(true); // reaching bottom re-engages
				return next;
			});
		},
		[clamp, maxOffset],
	);

	const scrollTo = useCallback(
		(index: number) => {
			setOffsetRaw(clamp(index));
		},
		[clamp],
	);

	// Re-clamp on dynamic totalLines/viewHeight changes
	useEffect(() => {
		setOffsetRaw((prev) => clamp(prev));
	}, [clamp]);

	// Auto-scroll: pin to bottom when enabled and totalLines grows
	useEffect(() => {
		if (autoScroll) {
			setOffsetRaw(maxOffset);
		}
	}, [autoScroll, maxOffset]);

	return { offset, setOffset, scrollBy, scrollTo, autoScroll, setAutoScroll };
}
