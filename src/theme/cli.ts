import chalk from 'chalk';
import type { CLITheme } from '../types/theme.js';

export function createCLITheme(brandHex: string): CLITheme {
	const brandFn = chalk.hex(brandHex);
	return {
		brand: brandFn,
		emphasis: brandFn,
		success: chalk.green,
		error: chalk.red,
		warning: chalk.yellow,
		dim: chalk.dim,
	};
}
