import { describe, expect, it } from 'vitest';
import {
	e2eConfig,
	reactConfig,
	rootConfig,
	typeConfig,
	unitConfig,
} from './vitest.js';

describe('unitConfig', () => {
	it('returns node environment', () => {
		expect(unitConfig().test?.environment).toBe('node');
	});

	it('includes .test.ts files', () => {
		expect(unitConfig().test?.include).toContain('**/*.test.ts');
	});

	it('excludes .test.tsx and .test-d.ts', () => {
		const config = unitConfig();
		expect(config.test?.exclude).toContain('**/*.test.tsx');
		expect(config.test?.exclude).toContain('**/*.test-d.ts');
	});

	it('accepts custom plugins', () => {
		const plugin = { name: 'test-plugin' };
		const config = unitConfig({ plugins: [plugin as never] });
		expect(config.plugins).toContainEqual(plugin);
	});

	it('accepts custom define', () => {
		const config = unitConfig({ define: { MY_VAR: '"test"' } });
		expect(config.define).toHaveProperty('MY_VAR', '"test"');
	});
});

describe('reactConfig', () => {
	it('returns jsdom environment', () => {
		expect(reactConfig().test?.environment).toBe('jsdom');
	});

	it('includes .test.tsx files', () => {
		expect(reactConfig().test?.include).toContain('**/*.test.tsx');
	});
});

describe('e2eConfig', () => {
	it('uses forks pool', () => {
		expect(e2eConfig().test?.pool).toBe('forks');
	});

	it('has 30s test timeout', () => {
		expect(e2eConfig().test?.testTimeout).toBe(30000);
	});
});

describe('typeConfig', () => {
	it('enables typecheck', () => {
		expect(typeConfig().test?.typecheck?.enabled).toBe(true);
	});

	it('includes .test-d.ts files', () => {
		expect(typeConfig().test?.include).toContain('**/*.test-d.ts');
	});
});

describe('rootConfig', () => {
	it('lists all project configs', () => {
		const config = rootConfig();
		expect(config.test?.projects).toContain('./vitest.unit.config.ts');
		expect(config.test?.projects).toContain('./vitest.react.config.ts');
		expect(config.test?.projects).toContain('./vitest.e2e.config.ts');
		expect(config.test?.projects).toContain('./vitest.type.config.ts');
	});

	it('includes coverage config', () => {
		const coverage = rootConfig().test?.coverage as
			| { include?: string[] }
			| undefined;
		expect(coverage?.include).toContain('src/**/*.{ts,tsx}');
	});
});
