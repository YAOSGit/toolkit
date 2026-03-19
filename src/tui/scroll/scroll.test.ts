// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { useScrollState } from './index.js';

describe('useScrollState', () => {
	it('initializes with offset 0', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20 }),
		);
		expect(result.current.offset).toBe(0);
	});

	it('initializes with autoScroll false by default', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20 }),
		);
		expect(result.current.autoScroll).toBe(false);
	});

	it('initializes with autoScroll when option is set', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20, autoScroll: true }),
		);
		expect(result.current.autoScroll).toBe(true);
	});

	it('scrollBy(1) increases offset', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20 }),
		);

		act(() => {
			result.current.scrollBy(1);
		});
		expect(result.current.offset).toBe(1);
	});

	it('scrollBy(-1) decreases offset, clamped at 0', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20 }),
		);

		act(() => {
			result.current.scrollBy(-1);
		});
		expect(result.current.offset).toBe(0);
	});

	it('offset is clamped to maxOffset', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 30, viewHeight: 20 }),
		);

		act(() => {
			result.current.scrollBy(999);
		});
		// maxOffset = 30 - 20 = 10
		expect(result.current.offset).toBe(10);
	});

	it('setOffset sets exact value within bounds', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20 }),
		);

		act(() => {
			result.current.setOffset(50);
		});
		expect(result.current.offset).toBe(50);
	});

	it('setOffset clamps to maxOffset', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 30, viewHeight: 20 }),
		);

		act(() => {
			result.current.setOffset(999);
		});
		expect(result.current.offset).toBe(10);
	});

	it('scrollTo sets offset directly', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20 }),
		);

		act(() => {
			result.current.scrollTo(25);
		});
		expect(result.current.offset).toBe(25);
	});

	it('auto-scroll pins offset to bottom', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20, autoScroll: true }),
		);
		// maxOffset = 80, auto-scroll should pin there
		expect(result.current.offset).toBe(80);
	});

	it('scrolling up disengages auto-scroll', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20, autoScroll: true }),
		);
		expect(result.current.autoScroll).toBe(true);

		act(() => {
			result.current.scrollBy(-5);
		});
		expect(result.current.autoScroll).toBe(false);
	});

	it('reaching bottom re-engages auto-scroll', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 30, viewHeight: 20 }),
		);

		act(() => {
			// Scroll all the way down — maxOffset is 10
			result.current.scrollBy(999);
		});
		expect(result.current.offset).toBe(10);
		expect(result.current.autoScroll).toBe(true);
	});

	it('setOffset disengages auto-scroll', () => {
		const { result } = renderHook(() =>
			useScrollState({ totalLines: 100, viewHeight: 20, autoScroll: true }),
		);

		act(() => {
			result.current.setOffset(5);
		});
		expect(result.current.autoScroll).toBe(false);
	});

	it('works without options', () => {
		const { result } = renderHook(() => useScrollState());
		expect(result.current.offset).toBe(0);
		expect(result.current.autoScroll).toBe(false);
	});

	it('re-clamps when totalLines changes', () => {
		let totalLines = 100;
		const { result, rerender } = renderHook(() =>
			useScrollState({ totalLines, viewHeight: 20 }),
		);

		act(() => {
			result.current.setOffset(70);
		});
		expect(result.current.offset).toBe(70);

		// Shrink totalLines so maxOffset = 10
		totalLines = 30;
		rerender();
		expect(result.current.offset).toBe(10);
	});
});
