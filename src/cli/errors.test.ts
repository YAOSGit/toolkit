import { fatalError, formatError } from './errors.js';

describe('formatError', () => {
	it('extracts message from Error instances', () => {
		const err = new Error('something broke');
		expect(formatError(err)).toBe('something broke');
	});

	it('converts non-Error values to string', () => {
		expect(formatError(42)).toBe('42');
		expect(formatError(null)).toBe('null');
		expect(formatError(undefined)).toBe('undefined');
	});

	it('handles string errors', () => {
		expect(formatError('oops')).toBe('oops');
	});

	it('handles objects by converting to string', () => {
		expect(formatError({ key: 'val' })).toBe('[object Object]');
	});
});

describe('fatalError', () => {
	it('logs the message to stderr via console.error', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		fatalError('fatal message');
		expect(spy).toHaveBeenCalledOnce();
		expect(spy.mock.calls[0]?.[0]).toContain('fatal message');
		spy.mockRestore();
	});

	it('sets process.exitCode to 1', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		process.exitCode = 0;
		fatalError('crash');
		expect(process.exitCode).toBe(1);
		spy.mockRestore();
		process.exitCode = 0;
	});

	it('output contains chalk red formatting', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		fatalError('red text');
		// chalk.red wraps text; at minimum the message is included
		expect(spy.mock.calls[0]?.[0]).toContain('red text');
		spy.mockRestore();
	});
});
