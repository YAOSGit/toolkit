import { relative } from 'node:path';
import { watch as chokidarWatch } from 'chokidar';

export type WatchOptions = {
	patterns: string[];
	cwd?: string;
	debounceMs?: number;
	ignoreInitial?: boolean;
};

export type WatchHandle = {
	close: () => Promise<void>;
	ready: Promise<void>;
};

export function watch(
	options: WatchOptions,
	onChange: (paths: string[]) => void,
	onError?: (error: Error) => void,
): WatchHandle {
	const { patterns, cwd, debounceMs = 300, ignoreInitial = true } = options;

	const watcher = chokidarWatch(patterns, {
		cwd,
		ignoreInitial,
	});

	let pending = new Set<string>();
	let timer: ReturnType<typeof setTimeout> | null = null;

	function flush() {
		if (pending.size === 0) return;
		const paths = [...pending];
		pending = new Set();
		timer = null;
		onChange(paths);
	}

	function onEvent(filePath: string) {
		const reportedPath = cwd ? relative(cwd, filePath) : filePath;
		pending.add(reportedPath);
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(flush, debounceMs);
	}

	watcher.on('add', onEvent);
	watcher.on('change', onEvent);
	watcher.on('unlink', onEvent);

	watcher.on('error', (error: unknown) => {
		if (onError) {
			onError(error instanceof Error ? error : new Error(String(error)));
		}
	});

	const ready = new Promise<void>((resolve) => {
		watcher.on('ready', resolve);
	});

	return {
		close: () => {
			if (timer !== null) {
				clearTimeout(timer);
			}
			return watcher.close();
		},
		ready,
	};
}
