import { spawnSync } from 'node:child_process';
import { constants } from 'node:os';

const COMMAND_RE = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
const SIGNAL_EXIT_OFFSET = 128;

export function spawnCommand(
	command: string,
	args?: string[],
	options?: { cwd?: string; shell?: boolean },
): number {
	const cwd = options?.cwd;
	const shell = options?.shell ?? false;

	if (shell) {
		const fullCommand =
			args && args.length > 0 ? `${command} ${args.join(' ')}` : command;
		const result = spawnSync(fullCommand, {
			shell: true,
			stdio: 'inherit',
			cwd,
		});

		if (result.error) return 1;
		if (result.signal) {
			const signalNum = constants.signals[result.signal] ?? 0;
			return SIGNAL_EXIT_OFFSET + signalNum;
		}
		return result.status ?? 1;
	}

	// Parse command string into tokens
	const tokens: string[] = [];
	let match: RegExpExecArray | null;
	COMMAND_RE.lastIndex = 0;
	while ((match = COMMAND_RE.exec(command)) !== null) {
		tokens.push(match[1] ?? match[2] ?? match[0]!);
	}

	const executable = tokens[0]!;
	const parsedArgs = [...tokens.slice(1), ...(args ?? [])];

	const result = spawnSync(executable, parsedArgs, { stdio: 'inherit', cwd });

	if (result.error) return 1;
	if (result.signal) {
		const signalNum = constants.signals[result.signal] ?? 0;
		return SIGNAL_EXIT_OFFSET + signalNum;
	}
	return result.status ?? 1;
}
