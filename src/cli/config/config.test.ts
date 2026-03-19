import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';
import { loadConfig, saveConfig } from './index.js';

describe('loadConfig', () => {
	let tempDir: string;

	beforeEach(() => {
		tempDir = mkdtempSync(join(tmpdir(), 'toolkit-config-test-'));
	});

	it('loads a single JSON config file', () => {
		const schema = z.object({ name: z.string(), port: z.number() });
		const filePath = join(tempDir, 'config.json');
		writeFileSync(filePath, JSON.stringify({ name: 'app', port: 3000 }));

		const { config, warnings } = loadConfig({ schema, global: filePath });
		expect(config.name).toBe('app');
		expect(config.port).toBe(3000);
		expect(warnings).toHaveLength(0);
	});

	it('loads a single YAML config file', () => {
		const schema = z.object({ host: z.string(), debug: z.boolean() });
		const filePath = join(tempDir, 'config.yaml');
		writeFileSync(filePath, 'host: localhost\ndebug: true\n');

		const { config, warnings } = loadConfig({ schema, global: filePath });
		expect(config.host).toBe('localhost');
		expect(config.debug).toBe(true);
		expect(warnings).toHaveLength(0);
	});

	it('merges global and local configs with local taking precedence', () => {
		const schema = z.object({ name: z.string(), port: z.number() });
		const globalPath = join(tempDir, 'global.json');
		const localPath = join(tempDir, 'local.json');
		writeFileSync(globalPath, JSON.stringify({ name: 'global', port: 8080 }));
		writeFileSync(localPath, JSON.stringify({ name: 'local' }));

		const { config } = loadConfig({
			schema,
			global: globalPath,
			local: localPath,
		});
		expect(config.name).toBe('local');
		expect(config.port).toBe(8080);
	});

	it('applies defaults when files do not exist', () => {
		const schema = z.object({ name: z.string(), port: z.number() });
		const { config, warnings } = loadConfig({
			schema,
			defaults: { name: 'default', port: 9090 },
		});
		expect(config.name).toBe('default');
		expect(config.port).toBe(9090);
		expect(warnings).toHaveLength(0);
	});

	it('collects validation warnings instead of throwing', () => {
		const schema = z.object({ name: z.string(), port: z.number() });
		const filePath = join(tempDir, 'bad.json');
		writeFileSync(
			filePath,
			JSON.stringify({ name: 123, port: 'not-a-number' }),
		);

		const { warnings } = loadConfig({
			schema,
			defaults: { name: 'fallback', port: 0 },
			global: filePath,
		});
		expect(warnings.length).toBeGreaterThan(0);
	});
});

describe('saveConfig', () => {
	let tempDir: string;

	beforeEach(() => {
		tempDir = mkdtempSync(join(tmpdir(), 'toolkit-config-save-'));
	});

	it('writes JSON with tab indentation', () => {
		const filePath = join(tempDir, 'out.json');
		saveConfig(filePath, { key: 'value' });
		const raw = readFileSync(filePath, 'utf-8');
		expect(raw).toContain('\t');
		expect(JSON.parse(raw)).toEqual({ key: 'value' });
	});

	it('roundtrips config through save and load', () => {
		const schema = z.object({ name: z.string(), count: z.number() });
		const filePath = join(tempDir, 'round.json');
		saveConfig(filePath, { name: 'test', count: 42 });

		const { config } = loadConfig({ schema, global: filePath });
		expect(config.name).toBe('test');
		expect(config.count).toBe(42);
	});
});
