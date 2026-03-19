import { describe, expect, it } from 'vitest';
import { createTUITheme } from './tui.js';

describe('createTUITheme', () => {
	it('returns all required theme fields', () => {
		const theme = createTUITheme('#00C4FF');
		expect(theme).toHaveProperty('brand');
		expect(theme).toHaveProperty('brandHex', '#00C4FF');
		expect(theme).toHaveProperty('focus');
		expect(theme).toHaveProperty('shell');
		expect(theme).toHaveProperty('muted');
		expect(theme).toHaveProperty('success', 'green');
		expect(theme).toHaveProperty('error', 'red');
		expect(theme).toHaveProperty('warning', 'yellow');
		expect(theme).toHaveProperty('info', 'cyan');
	});

	it('auto-maps #EA0084 (run-tui pink) to magenta', () => {
		expect(createTUITheme('#EA0084').brand).toBe('magenta');
	});

	it('auto-maps #00C4FF (blueprint-tui sky blue) to cyan', () => {
		expect(createTUITheme('#00C4FF').brand).toBe('cyan');
	});

	it('auto-maps #8514CA (mesh-sync purple) to magenta', () => {
		expect(createTUITheme('#8514CA').brand).toBe('magenta');
	});

	it('auto-maps #FFCC42 (prompt-opm gold) to yellow', () => {
		expect(createTUITheme('#FFCC42').brand).toBe('yellow');
	});

	it('auto-maps #AE0017 (run-ctx crimson) to red', () => {
		expect(createTUITheme('#AE0017').brand).toBe('red');
	});

	it('uses brandName override when auto-mapping is inaccurate', () => {
		const theme = createTUITheme('#13B093', 'green');
		expect(theme.brand).toBe('green');
	});

	it('uses brandName override for perceptually ambiguous colors', () => {
		const theme = createTUITheme('#6E74ED', 'blue');
		expect(theme.brand).toBe('blue');
	});

	it('uses brandName override for orange to yellow', () => {
		const theme = createTUITheme('#ED741D', 'yellow');
		expect(theme.brand).toBe('yellow');
	});

	it('preserves original hex in brandHex', () => {
		const theme = createTUITheme('#13B093', 'green');
		expect(theme.brandHex).toBe('#13B093');
	});
});
