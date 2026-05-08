import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';

export function createCLI(options: {
	name: string;
	description: string;
	version: string;
	buildHash?: string;
	toolkitVersion?: string;
}): { program: Command } {
	const scopedName = `@yaos-git/${options.name}`;
	const build = options.buildHash ?? 'dev';
	const toolkit = options.toolkitVersion ?? 'unknown';

	const versionString = [
		'\u250C\u2500\u2500\u2500\u2510',
		`\u2502 \u00BB \u2502  ${scopedName}`,
		'\u2514\u2500\u25CF\u2500\u2518',
		'',
		`       version   ${options.version}`,
		`       node      ${process.versions.node}`,
		`       toolkit   ${toolkit}`,
		`       build     ${build}`,
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
