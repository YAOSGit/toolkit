import chalk from 'chalk';

export function formatError(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

export function fatalError(message: string): void {
	console.error(chalk.red(message));
	process.exitCode = 1;
}

export const getExitCode = (err: unknown): number => {
	const error = err as { exitCode?: number };
	return error.exitCode ?? 1;
};
