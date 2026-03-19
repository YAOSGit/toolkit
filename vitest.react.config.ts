import { defineConfig } from 'vitest/config';
export default defineConfig({
	test: {
		name: { label: 'react', color: 'cyan' },
		environment: 'jsdom',
		globals: true,
		include: ['**/*.test.tsx'],
		exclude: ['node_modules'],
		sequence: { groupOrder: 2 },
	},
});
