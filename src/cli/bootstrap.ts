import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';

export function createCLI(options: {
	name: string;
	description: string;
	version: string;
}): { program: Command } {
	const versionString = [
		`${options.name}/${options.version}`,
		`node/${process.versions.node}`,
		process.platform,
	].join('\n');

	const program = new Command()
		.name(options.name)
		.description(options.description)
		.version(versionString)
		.allowExcessArguments(true)
		.enablePositionalOptions()
		.exitOverride();

	process.on('SIGINT', () => {
		process.exitCode = 130;
	});
	process.on('SIGTERM', () => {
		process.exitCode = 143;
	});

	return { program };
}

export function runIfMain(importMetaUrl: string, fn: () => void): void {
	try {
		const scriptPath = realpathSync(process.argv[1]!);
		const callerPath = fileURLToPath(importMetaUrl);
		if (scriptPath === callerPath) {
			fn();
		}
	} catch {
		// silently ignore
	}
}
