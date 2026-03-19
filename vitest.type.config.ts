import { defineConfig } from 'vitest/config';

export default defineConfig({
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
		exclude: ['node_modules', '**/*.test.ts'],
		sequence: {
			groupOrder: 1,
		},
	},
});
