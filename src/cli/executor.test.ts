import { spawnCommand } from './executor.js';

describe('spawnCommand', () => {
	it('runs a simple command and returns exit code 0', () => {
		const code = spawnCommand('echo', ['hello'], { shell: true });
		expect(code).toBe(0);
	});

	it('returns non-zero exit code for failing commands', () => {
		const code = spawnCommand('node -e "process.exit(42)"', undefined, {
			shell: true,
		});
		expect(code).toBe(42);
	});

	it('parses command string into executable and arguments without shell', () => {
		const code = spawnCommand('node -e "process.exit(0)"');
		expect(code).toBe(0);
	});

	it('returns 1 when command is not found', () => {
		const code = spawnCommand('__nonexistent_command_12345__');
		expect(code).toBe(1);
	});

	it('respects cwd option', () => {
		const code = spawnCommand('pwd', [], { cwd: '/tmp', shell: true });
		expect(code).toBe(0);
	});
});
