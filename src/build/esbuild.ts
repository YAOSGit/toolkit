import { readFileSync } from 'node:fs';
import { builtinModules, createRequire } from 'node:module';
import type * as esbuild from 'esbuild';

const requireShim = `
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
`;

export function createEsbuildConfig(options: {
	entry: string | string[];
	plugins?: esbuild.Plugin[];
	banner?: string;
	define?: Record<string, string>;
}): esbuild.BuildOptions {
	const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
	const version = packageJson.version;

	const builtinPlugins: esbuild.Plugin[] = [
		{
			name: 'dedup-react',
			setup(build) {
				const cwd = process.cwd();
				const dedup = /^(react|react-dom|ink)(\/.*)?$/;
				build.onResolve({ filter: dedup }, (args) => {
					if (args.resolveDir.startsWith(cwd)) return undefined;
					try {
						const resolved = createRequire(
							`${cwd}/package.json`,
						).resolve(args.path);
						return { path: resolved };
					} catch {
						return undefined;
					}
				});
			},
		},
		{
			name: 'node-builtins-to-node-prefix',
			setup(build) {
				const filter = new RegExp(`^(${builtinModules.join('|')})$`);
				build.onResolve({ filter }, (args) => ({
					path: `node:${args.path}`,
					external: true,
				}));
			},
		},
		{
			name: 'stub-react-devtools',
			setup(build) {
				build.onResolve({ filter: /^react-devtools-core$/ }, () => ({
					path: 'react-devtools-core',
					namespace: 'stub',
				}));
				build.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
					contents: 'export default undefined;',
					loader: 'js',
				}));
			},
		},
	];

	return {
		entryPoints: Array.isArray(options.entry) ? options.entry : [options.entry],
		bundle: true,
		platform: 'node',
		format: 'esm',
		minify: true,
		tsconfig: 'tsconfig.app.json',
		external: builtinModules.map((m) => `node:${m}`),
		banner: {
			js: options.banner ?? requireShim,
		},
		define: {
			__CLI_VERSION__: JSON.stringify(version),
			...options.define,
		},
		supported: {
			'top-level-await': true,
		},
		plugins: [...builtinPlugins, ...(options.plugins ?? [])],
		mainFields: ['module', 'main'],
		conditions: ['import', 'node'],
	};
}
