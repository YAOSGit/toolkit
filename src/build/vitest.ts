import type { ViteUserConfig } from 'vitest/config';

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number];

export function unitConfig(options?: {
	plugins?: VitePlugin[];
	define?: Record<string, string>;
}): ViteUserConfig {
	return {
		plugins: options?.plugins,
		define: {
			__CLI_VERSION__: JSON.stringify('0.0.0-test'),
			__BUILD_HASH__: JSON.stringify('test'),
			__TOOLKIT_VERSION__: JSON.stringify('0.0.0-test'),
			...options?.define,
		},
		test: {
			name: { label: 'unit', color: 'green' },
			environment: 'node',
			globals: true,
			typecheck: {
				tsconfig: './tsconfig.vitest.json',
			},
			include: ['**/*.test.ts'],
			exclude: ['node_modules', 'examples', '**/*.test.tsx', '**/*.test-d.ts'],
			sequence: {
				groupOrder: 1,
			},
		},
	};
}

export function reactConfig(): ViteUserConfig {
	return {
		define: {
			__CLI_VERSION__: JSON.stringify('0.0.0-test'),
			__BUILD_HASH__: JSON.stringify('test'),
			__TOOLKIT_VERSION__: JSON.stringify('0.0.0-test'),
		},
		test: {
			name: { label: 'react', color: 'cyan' },
			environment: 'jsdom',
			globals: true,
			typecheck: {
				tsconfig: './tsconfig.vitest.json',
			},
			include: ['**/*.test.tsx'],
			exclude: ['node_modules'],
			sequence: {
				groupOrder: 2,
			},
		},
	};
}

export function e2eConfig(): ViteUserConfig {
	return {
		test: {
			name: { label: 'e2e', color: 'yellow' },
			environment: 'node',
			globals: true,
			testTimeout: 30000,
			hookTimeout: 10000,
			typecheck: {
				tsconfig: './tsconfig.vitest.json',
			},
			include: ['e2e/*.e2e.ts'],
			exclude: ['node_modules'],
			pool: 'forks',
			maxWorkers: 1,
			isolate: false,
			sequence: {
				groupOrder: 3,
			},
		},
	};
}

export function typeConfig(): ViteUserConfig {
	return {
		test: {
			name: { label: 'type-tests', color: 'magenta' },
			environment: 'node',
			globals: true,
			typecheck: {
				enabled: true,
				checker: 'tsgo',
				tsconfig: './tsconfig.vitest.json',
				include: ['**/*.test-d.ts'],
			},
			include: ['**/*.test-d.ts'],
			exclude: ['node_modules', '**/*.test.ts', '**/*.test.tsx'],
			sequence: {
				groupOrder: 1,
			},
		},
	};
}

export function rootConfig(): ViteUserConfig {
	return {
		test: {
			projects: [
				'./vitest.unit.config.ts',
				'./vitest.type.config.ts',
				'./vitest.react.config.ts',
				'./vitest.e2e.config.ts',
			],
			coverage: {
				include: ['src/**/*.{ts,tsx}'],
				exclude: [
					'e2e/**',
					'src/app/**',
					'node_modules/**',
					'**/*.test.{ts,tsx}',
					'**/*.test-d.ts',
				],
			},
		},
	};
}
