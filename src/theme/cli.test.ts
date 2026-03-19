import { describe, expect, it } from 'vitest';
import { createCLITheme } from './cli.js';

describe('createCLITheme', () => {
	it('returns all required formatter fields', () => {
		const theme = createCLITheme('#8514CA');
		expect(typeof theme.brand).toBe('function');
		expect(typeof theme.emphasis).toBe('function');
		expect(typeof theme.success).toBe('function');
		expect(typeof theme.error).toBe('function');
		expect(typeof theme.warning).toBe('function');
		expect(typeof theme.dim).toBe('function');
	});

	it('brand formatter returns string containing the input', () => {
		const theme = createCLITheme('#8514CA');
		expect(theme.brand('hello')).toContain('hello');
	});

	it('success formatter returns string containing the input', () => {
		const theme = createCLITheme('#8514CA');
		expect(theme.success('ok')).toContain('ok');
	});

	it('dim formatter returns string containing the input', () => {
		const theme = createCLITheme('#8514CA');
		expect(theme.dim('muted')).toContain('muted');
	});

	it('emphasis is the same formatter as brand', () => {
		const theme = createCLITheme('#EA0084');
		expect(theme.brand('x')).toBe(theme.emphasis('x'));
	});
});
