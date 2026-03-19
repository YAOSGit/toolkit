// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { useOverlayState } from './index.js';

describe('useOverlayState', () => {
	it('initializes with activeOverlay as "none"', () => {
		const { result } = renderHook(() => useOverlayState<'help' | 'settings'>());
		expect(result.current.activeOverlay).toBe('none');
	});

	it('initializes with confirmation as null', () => {
		const { result } = renderHook(() => useOverlayState<'help'>());
		expect(result.current.confirmation).toBeNull();
	});

	it('setActiveOverlay changes the overlay', () => {
		const { result } = renderHook(() => useOverlayState<'help' | 'settings'>());

		act(() => {
			result.current.setActiveOverlay('help');
		});

		expect(result.current.activeOverlay).toBe('help');
	});

	it('setActiveOverlay can reset to "none"', () => {
		const { result } = renderHook(() => useOverlayState<'help'>());

		act(() => {
			result.current.setActiveOverlay('help');
		});
		expect(result.current.activeOverlay).toBe('help');

		act(() => {
			result.current.setActiveOverlay('none');
		});
		expect(result.current.activeOverlay).toBe('none');
	});

	it('requestConfirmation stores message and callback', () => {
		const { result } = renderHook(() => useOverlayState());
		const onConfirm = vi.fn();

		act(() => {
			result.current.requestConfirmation('Are you sure?', onConfirm);
		});

		expect(result.current.confirmation).not.toBeNull();
		expect(result.current.confirmation?.message).toBe('Are you sure?');
		expect(result.current.confirmation?.onConfirm).toBe(onConfirm);
	});

	it('clearConfirmation resets confirmation to null', () => {
		const { result } = renderHook(() => useOverlayState());
		const onConfirm = vi.fn();

		act(() => {
			result.current.requestConfirmation('Delete?', onConfirm);
		});
		expect(result.current.confirmation).not.toBeNull();

		act(() => {
			result.current.clearConfirmation();
		});
		expect(result.current.confirmation).toBeNull();
	});

	it('confirmation callback is invocable', () => {
		const { result } = renderHook(() => useOverlayState());
		const onConfirm = vi.fn();

		act(() => {
			result.current.requestConfirmation('Proceed?', onConfirm);
		});

		result.current.confirmation?.onConfirm();
		expect(onConfirm).toHaveBeenCalledOnce();
	});
});
