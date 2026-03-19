import { describe, expect, it } from 'vitest';
import { createEsbuildConfig } from './esbuild.js';

describe('createEsbuildConfig', () => {
	it('returns a valid esbuild config object', () => {
		const config = createEsbuildConfig({ entry: 'src/app/cli.tsx' });
		expect(config.entryPoints).toEqual(['src/app/cli.tsx']);
		expect(config.bundle).toBe(true);
		expect(config.platform).toBe('node');
		expect(config.format).toBe('esm');
		expect(config.minify).toBe(true);
	});

	it('includes requireShim in banner', () => {
		const config = createEsbuildConfig({ entry: 'src/app/cli.tsx' });
		expect(config.banner?.js).toContain('createRequire');
	});

	it('injects __CLI_VERSION__ define', () => {
		const config = createEsbuildConfig({ entry: 'src/app/cli.tsx' });
		expect(config.define).toHaveProperty('__CLI_VERSION__');
	});

	it('externalizes node builtins with node: prefix', () => {
		const config = createEsbuildConfig({ entry: 'src/app/cli.tsx' });
		expect(config.external).toContain('node:fs');
		expect(config.external).toContain('node:path');
	});

	it('includes node-builtins-to-node-prefix plugin', () => {
		const config = createEsbuildConfig({ entry: 'src/app/cli.tsx' });
		const names = config.plugins?.map((p) => p.name) ?? [];
		expect(names).toContain('node-builtins-to-node-prefix');
	});

	it('includes stub-react-devtools plugin', () => {
		const config = createEsbuildConfig({ entry: 'src/app/cli.tsx' });
		const names = config.plugins?.map((p) => p.name) ?? [];
		expect(names).toContain('stub-react-devtools');
	});

	it('accepts extra plugins', () => {
		const custom = { name: 'my-plugin', setup: () => {} };
		const config = createEsbuildConfig({
			entry: 'src/app/cli.tsx',
			plugins: [custom],
		});
		const names = config.plugins?.map((p) => p.name) ?? [];
		expect(names).toContain('my-plugin');
		expect(names).toContain('node-builtins-to-node-prefix');
	});

	it('accepts entry as array', () => {
		const config = createEsbuildConfig({
			entry: ['src/app/cli.tsx', 'src/app/editor.tsx'],
		});
		expect(config.entryPoints).toEqual([
			'src/app/cli.tsx',
			'src/app/editor.tsx',
		]);
	});

	it('accepts extra define values', () => {
		const config = createEsbuildConfig({
			entry: 'src/app/cli.tsx',
			define: { MY_FLAG: '"true"' },
		});
		expect(config.define).toHaveProperty('MY_FLAG', '"true"');
		expect(config.define).toHaveProperty('__CLI_VERSION__');
	});

	it('supports top-level-await', () => {
		const config = createEsbuildConfig({ entry: 'src/app/cli.tsx' });
		expect(config.supported).toHaveProperty('top-level-await', true);
	});
});
