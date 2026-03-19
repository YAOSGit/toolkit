import { assertType, describe, it } from 'vitest';
import type { CLITheme, TUITheme } from './theme.js';

describe('TUITheme', () => {
	it('has all required color fields', () => {
		assertType<TUITheme>({
			brand: 'cyan',
			brandHex: '#00C4FF',
			focus: 'cyan',
			shell: 'blue',
			muted: 'gray',
			success: 'green',
			error: 'red',
			warning: 'yellow',
			info: 'cyan',
		});
	});
});

describe('CLITheme', () => {
	it('has all required formatter fields', () => {
		const theme: CLITheme = {
			brand: (t: string) => t,
			emphasis: (t: string) => t,
			success: (t: string) => t,
			error: (t: string) => t,
			warning: (t: string) => t,
			dim: (t: string) => t,
		};
		assertType<CLITheme>(theme);
	});
});
