import { METHOD_COLORS, statusColor } from './index.js';

describe('METHOD_COLORS', () => {
	it('maps GET to green', () => {
		expect(METHOD_COLORS.GET).toBe('green');
	});

	it('maps POST to yellow', () => {
		expect(METHOD_COLORS.POST).toBe('yellow');
	});

	it('maps PUT to blue', () => {
		expect(METHOD_COLORS.PUT).toBe('blue');
	});

	it('maps PATCH to cyan', () => {
		expect(METHOD_COLORS.PATCH).toBe('cyan');
	});

	it('maps DELETE to red', () => {
		expect(METHOD_COLORS.DELETE).toBe('red');
	});

	it('maps HEAD to gray', () => {
		expect(METHOD_COLORS.HEAD).toBe('gray');
	});

	it('maps OPTIONS to gray', () => {
		expect(METHOD_COLORS.OPTIONS).toBe('gray');
	});

	it('contains all standard HTTP methods', () => {
		const methods = [
			'GET',
			'POST',
			'PUT',
			'PATCH',
			'DELETE',
			'HEAD',
			'OPTIONS',
		];
		for (const method of methods) {
			expect(METHOD_COLORS).toHaveProperty(method);
		}
	});
});

describe('statusColor', () => {
	it('returns green for 2xx status codes', () => {
		expect(statusColor(200)).toBe('green');
		expect(statusColor(201)).toBe('green');
		expect(statusColor(299)).toBe('green');
	});

	it('returns yellow for 3xx status codes', () => {
		expect(statusColor(301)).toBe('yellow');
		expect(statusColor(304)).toBe('yellow');
	});

	it('returns red for 4xx status codes', () => {
		expect(statusColor(404)).toBe('red');
		expect(statusColor(403)).toBe('red');
	});

	it('returns magenta for 5xx status codes', () => {
		expect(statusColor(500)).toBe('magenta');
		expect(statusColor(503)).toBe('magenta');
	});

	it('returns gray for 1xx status codes', () => {
		expect(statusColor(100)).toBe('gray');
		expect(statusColor(101)).toBe('gray');
	});

	it('returns gray for unknown status codes', () => {
		expect(statusColor(0)).toBe('gray');
		expect(statusColor(999)).toBe('gray');
	});
});
