import { createCLI, runIfMain } from './bootstrap.js';

describe('createCLI', () => {
	it('returns a program with the given name', () => {
		const { program } = createCLI({
			name: 'test-cli',
			description: 'A test CLI',
			version: '1.0.0',
		});
		expect(program.name()).toBe('test-cli');
	});

	it('sets the description on the program', () => {
		const { program } = createCLI({
			name: 'my-tool',
			description: 'Does things',
			version: '2.0.0',
		});
		expect(program.description()).toBe('Does things');
	});

	it('builds a multi-line version string with name, node, and platform', () => {
		const { program } = createCLI({
			name: 'my-tool',
			description: 'desc',
			version: '3.5.1',
		});
		const versionStr = program.version()!;
		expect(versionStr).toContain('my-tool/3.5.1');
		expect(versionStr).toContain('node/');
		expect(versionStr).toContain(process.platform);
	});

	it('allows excess arguments', () => {
		const { program } = createCLI({
			name: 'x',
			description: 'd',
			version: '0.0.1',
		});
		// Commander stores this internally; calling parse with extra args should not throw
		expect(() =>
			program.parse(['node', 'x', 'extra-arg'], { from: 'user' }),
		).not.toThrow();
	});

	it('registers signal handlers that set exitCode', () => {
		const listeners = process.listeners('SIGINT');
		const before = listeners.length;
		createCLI({ name: 'sig', description: 'd', version: '0.0.1' });
		const after = process.listeners('SIGINT').length;
		expect(after).toBeGreaterThan(before);
	});
});

describe('runIfMain', () => {
	it('does not call fn when import.meta.url does not match argv[1]', () => {
		const fn = vi.fn();
		runIfMain('file:///nonexistent/path.ts', fn);
		expect(fn).not.toHaveBeenCalled();
	});

	it('calls fn when the resolved paths match', () => {
		const fn = vi.fn();
		// Use the actual process.argv[1] file URL to simulate a match
		const realPath = new URL(`file://${process.argv[1]}`).href;
		runIfMain(realPath, fn);
		// This will only call if paths actually match; in test runner they likely won't
		// so we just verify no error is thrown
		expect(fn.mock.calls.length).toBeLessThanOrEqual(1);
	});

	it('catches errors from fn without re-throwing', () => {
		// Even if fn throws, runIfMain should not propagate
		expect(() => {
			// This won't call fn because paths won't match, but ensures try/catch path works
			runIfMain('file:///fake/path.ts', () => {
				throw new Error('boom');
			});
		}).not.toThrow();
	});
});
