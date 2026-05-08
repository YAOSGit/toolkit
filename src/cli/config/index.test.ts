import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { loadConfig, loadConfigAsync } from './index.js';

describe('loadConfig', () => {
	describe('TypeScript config files', () => {
		it('loads a .ts config file with default export', async () => {
			const dir = mkdtempSync(join(tmpdir(), 'config-test-'));
			const configPath = join(dir, 'test.config.ts');
			writeFileSync(configPath, `export default { name: 'test', value: 42 };`);

			const schema = z.object({ name: z.string(), value: z.number() });
			const { config, warnings } = await loadConfigAsync({
				schema,
				local: configPath,
			});

			expect(config).toEqual({ name: 'test', value: 42 });
			expect(warnings).toHaveLength(0);
			rmSync(dir, { recursive: true });
		});

		it('loads a .ts config file with defineConfig-style wrapper', async () => {
			const dir = mkdtempSync(join(tmpdir(), 'config-test-'));
			const configPath = join(dir, 'test.config.ts');
			writeFileSync(
				configPath,
				`
				const defineConfig = <T>(c: T) => c;
				export default defineConfig({ name: 'wrapped', value: 99 });
			`,
			);

			const schema = z.object({ name: z.string(), value: z.number() });
			const { config, warnings } = await loadConfigAsync({
				schema,
				local: configPath,
			});

			expect(config).toEqual({ name: 'wrapped', value: 99 });
			expect(warnings).toHaveLength(0);
			rmSync(dir, { recursive: true });
		});

		it('merges defaults with TS config', async () => {
			const dir = mkdtempSync(join(tmpdir(), 'config-test-'));
			const configPath = join(dir, 'test.config.ts');
			writeFileSync(configPath, `export default { name: 'override' };`);

			const schema = z.object({ name: z.string(), value: z.number() });
			const { config } = await loadConfigAsync({
				schema,
				defaults: { name: 'default', value: 10 },
				local: configPath,
			});

			expect(config).toEqual({ name: 'override', value: 10 });
			rmSync(dir, { recursive: true });
		});
	});
});
