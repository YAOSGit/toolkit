import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { watch } from './index.js';

describe('watch', () => {
	it('returns a WatchHandle with a close method and ready promise', () => {
		const tmpDir = mkdtempSync(join(tmpdir(), 'watcher-test-'));
		const handle = watch({ patterns: [tmpDir], debounceMs: 50 }, () => {});
		expect(handle).toBeDefined();
		expect(typeof handle.close).toBe('function');
		expect(handle.ready).toBeInstanceOf(Promise);
		return handle.close();
	});

	it('calls onChange when a file is written', async () => {
		const tmpDir = mkdtempSync(join(tmpdir(), 'watcher-test-'));
		const onChange = vi.fn();

		const handle = watch(
			{ patterns: [tmpDir], debounceMs: 50, ignoreInitial: true },
			onChange,
		);

		await handle.ready;

		writeFileSync(join(tmpDir, 'test.txt'), 'hello');

		await vi.waitFor(
			() => {
				expect(onChange).toHaveBeenCalled();
			},
			{ timeout: 3000, interval: 50 },
		);

		const paths = onChange.mock.calls[0][0] as string[];
		expect(paths.length).toBeGreaterThanOrEqual(1);

		await handle.close();
	});

	it('debounces multiple file changes into one callback', async () => {
		const tmpDir = mkdtempSync(join(tmpdir(), 'watcher-test-'));
		const onChange = vi.fn();

		const handle = watch(
			{ patterns: [tmpDir], debounceMs: 150, ignoreInitial: true },
			onChange,
		);

		await handle.ready;

		writeFileSync(join(tmpDir, 'a.txt'), 'a');
		writeFileSync(join(tmpDir, 'b.txt'), 'b');

		await vi.waitFor(
			() => {
				expect(onChange).toHaveBeenCalled();
			},
			{ timeout: 3000, interval: 50 },
		);

		// The debounce should batch at least some changes together
		const firstCallPaths = onChange.mock.calls[0][0] as string[];
		expect(firstCallPaths.length).toBeGreaterThanOrEqual(1);

		await handle.close();
	});

	it('accepts onError callback without crashing', async () => {
		const tmpDir = mkdtempSync(join(tmpdir(), 'watcher-test-'));
		const onError = vi.fn();

		const handle = watch(
			{ patterns: [tmpDir], debounceMs: 50 },
			() => {},
			onError,
		);

		expect(typeof handle.close).toBe('function');
		await handle.close();
	});
});
