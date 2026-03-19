import { spawnProcess } from './index.js';

describe('spawnProcess', () => {
	it('returns a handle with pid', () => {
		const handle = spawnProcess({ command: 'echo hello' });
		expect(handle.pid).toBeTypeOf('number');
		handle.kill();
	});

	it('receives stdout lines via onOutput', async () => {
		const lines: string[] = [];

		await new Promise<void>((resolve) => {
			spawnProcess({
				command: 'echo hello',
				onOutput: (line) => {
					lines.push(line);
				},
				onExit: () => resolve(),
			});
		});

		expect(lines).toContain('hello');
	});

	it('receives stderr lines via onOutput', async () => {
		const lines: string[] = [];

		await new Promise<void>((resolve) => {
			spawnProcess({
				command: 'echo error >&2',
				onOutput: (line) => {
					lines.push(line);
				},
				onExit: () => resolve(),
			});
		});

		expect(lines).toContain('error');
	});

	it('fires onExit with exit code 0', async () => {
		const code = await new Promise<number | null>((resolve) => {
			spawnProcess({
				command: 'echo done',
				onExit: (c) => resolve(c),
			});
		});

		expect(code).toBe(0);
	});

	it('fires onExit with non-zero exit code', async () => {
		const code = await new Promise<number | null>((resolve) => {
			spawnProcess({
				command: 'exit 42',
				onExit: (c) => resolve(c),
			});
		});

		expect(code).toBe(42);
	});

	it('kill() terminates the process', async () => {
		const code = await new Promise<number | null>((resolve) => {
			const handle = spawnProcess({
				command: 'sleep 60',
				onExit: (c) => resolve(c),
			});

			setTimeout(() => handle.kill(), 50);
		});

		// SIGTERM results in null exit code
		expect(code).toBeNull();
	});

	it('restart() re-spawns the process', async () => {
		const outputs: string[] = [];
		let exitCount = 0;

		await new Promise<void>((resolve) => {
			const handle = spawnProcess({
				command: 'echo restarted',
				onOutput: (line) => {
					outputs.push(line);
				},
				onExit: () => {
					exitCount++;
					if (exitCount === 1) {
						handle.restart();
					} else {
						resolve();
					}
				},
			});
		});

		expect(exitCount).toBe(2);
		expect(outputs.filter((l) => l === 'restarted')).toHaveLength(2);
	});

	it('accepts cwd option', async () => {
		const lines: string[] = [];

		await new Promise<void>((resolve) => {
			spawnProcess({
				command: 'pwd',
				cwd: '/tmp',
				onOutput: (line) => {
					lines.push(line);
				},
				onExit: () => resolve(),
			});
		});

		expect(lines[0]).toMatch(/^\/.*tmp/);
	});

	it('accepts env option', async () => {
		const lines: string[] = [];

		await new Promise<void>((resolve) => {
			spawnProcess({
				command: 'echo $MY_TEST_VAR',
				env: { MY_TEST_VAR: 'toolkit_test' },
				onOutput: (line) => {
					lines.push(line);
				},
				onExit: () => resolve(),
			});
		});

		expect(lines).toContain('toolkit_test');
	});

	it('pid is null after process exits', async () => {
		const handle = spawnProcess({ command: 'echo done' });

		await new Promise<void>((resolve) => {
			const check = setInterval(() => {
				if (handle.pid === null) {
					clearInterval(check);
					resolve();
				}
			}, 10);
		});

		expect(handle.pid).toBeNull();
	});
});
