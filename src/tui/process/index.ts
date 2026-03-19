import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';

export type ProcessOptions = {
	command: string;
	cwd?: string;
	env?: Record<string, string>;
	killTimeoutMs?: number;
	onOutput?: (line: string) => void;
	onExit?: (code: number | null) => void;
};

export type ProcessHandle = {
	pid: number | null;
	kill: () => void;
	restart: () => void;
};

export function spawnProcess(options: ProcessOptions): ProcessHandle {
	const { command, cwd, env, killTimeoutMs = 2000, onOutput, onExit } = options;

	let child: ChildProcess | null = null;
	let killTimer: ReturnType<typeof setTimeout> | null = null;

	const handle: ProcessHandle = {
		pid: null,
		kill: () => {
			if (!child) return;
			child.kill('SIGTERM');
			killTimer = setTimeout(() => {
				if (child && !child.killed) {
					child.kill('SIGKILL');
				}
			}, killTimeoutMs);
		},
		restart: () => {
			if (child && !child.killed) {
				const onKilled = () => {
					startProcess();
				};
				child.once('close', onKilled);
				handle.kill();
			} else {
				startProcess();
			}
		},
	};

	function attachStreams(proc: ChildProcess): void {
		const handleData = (data: Buffer) => {
			if (!onOutput) return;
			const text = data.toString();
			const lines = text.split('\n');
			if (lines[lines.length - 1] === '') {
				lines.pop();
			}
			for (const line of lines) {
				onOutput(line);
			}
		};

		proc.stdout?.on('data', handleData);
		proc.stderr?.on('data', handleData);

		proc.on('close', (code) => {
			if (killTimer) {
				clearTimeout(killTimer);
				killTimer = null;
			}
			handle.pid = null;
			child = null;
			onExit?.(code);
		});
	}

	function startProcess(): void {
		child = spawn('sh', ['-c', command], {
			stdio: 'pipe',
			cwd,
			env: env ? { ...process.env, ...env } : process.env,
		});
		handle.pid = child.pid ?? null;
		attachStreams(child);
	}

	startProcess();

	return handle;
}
