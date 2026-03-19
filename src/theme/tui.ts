import type { TUITheme } from '../types/theme.js';
import { colors } from './colors.js';

const ANSI_COLORS = [
	{ name: 'black', r: 0, g: 0, b: 0 },
	{ name: 'red', r: 255, g: 0, b: 0 },
	{ name: 'green', r: 0, g: 255, b: 0 },
	{ name: 'yellow', r: 255, g: 255, b: 0 },
	{ name: 'blue', r: 0, g: 0, b: 255 },
	{ name: 'magenta', r: 255, g: 0, b: 255 },
	{ name: 'cyan', r: 0, g: 255, b: 255 },
	{ name: 'white', r: 255, g: 255, b: 255 },
] as const;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const h = hex.replace('#', '');
	return {
		r: Number.parseInt(h.slice(0, 2), 16),
		g: Number.parseInt(h.slice(2, 4), 16),
		b: Number.parseInt(h.slice(4, 6), 16),
	};
}

function nearestAnsi(hex: string): string {
	const { r, g, b } = hexToRgb(hex);
	let best = 'white';
	let bestDist = Infinity;
	for (const c of ANSI_COLORS) {
		const dist = (r - c.r) ** 2 + (g - c.g) ** 2 + (b - c.b) ** 2;
		if (dist < bestDist) {
			bestDist = dist;
			best = c.name;
		}
	}
	return best;
}

export function createTUITheme(brandHex: string, brandName?: string): TUITheme {
	return {
		brand: brandName ?? nearestAnsi(brandHex),
		brandHex,
		focus: 'cyan',
		shell: 'blue',
		muted: colors.muted,
		success: colors.success,
		error: colors.error,
		warning: colors.warning,
		info: colors.info,
	};
}
