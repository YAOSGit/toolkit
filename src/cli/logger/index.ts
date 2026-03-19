import type { CLITheme } from '../../types/theme.js';

export type Logger = {
	info: (message: string) => void;
	verbose: (message: string) => void;
	success: (message: string) => void;
	warn: (message: string) => void;
	error: (message: string) => void;
	setVerbose: (enabled: boolean) => void;
};

export function createLogger(options: {
	prefix: string;
	theme: CLITheme;
	stderr?: boolean;
}): Logger {
	const { prefix, theme, stderr = false } = options;
	const out = stderr ? console.error : console.log;
	let verboseEnabled = false;

	return {
		info(message: string) {
			out(`${theme.brand(`[${prefix}]`)} ${message}`);
		},
		verbose(message: string) {
			if (!verboseEnabled) return;
			out(`${theme.dim(`[${prefix}]`)} ${theme.dim(message)}`);
		},
		success(message: string) {
			out(`${theme.success(`[${prefix}]`)} ${message}`);
		},
		warn(message: string) {
			console.error(`${theme.warning(`[${prefix}]`)} ${message}`);
		},
		error(message: string) {
			console.error(`${theme.error(`[${prefix}]`)} ${message}`);
		},
		setVerbose(enabled: boolean) {
			verboseEnabled = enabled;
		},
	};
}
