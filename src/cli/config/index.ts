import { existsSync, readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import type { ZodError, ZodSchema } from 'zod';
import { atomicWrite } from '../fs.js';

export type ConfigOptions<T> = {
	schema: ZodSchema<T>;
	defaults?: Partial<T>;
	global?: string;
	local?: string;
};

function isYamlFile(filePath: string): boolean {
	return filePath.endsWith('.yaml') || filePath.endsWith('.yml');
}

function isTsFile(filePath: string): boolean {
	return filePath.endsWith('.ts') || filePath.endsWith('.mts');
}

function readConfigFile(filePath: string): Record<string, unknown> {
	const raw = readFileSync(filePath, 'utf-8');
	if (isYamlFile(filePath)) {
		return (parseYaml(raw) as Record<string, unknown>) ?? {};
	}
	return JSON.parse(raw) as Record<string, unknown>;
}

function deepMerge(
	target: Record<string, unknown>,
	source: Record<string, unknown>,
): Record<string, unknown> {
	const result = { ...target };
	for (const key of Object.keys(source)) {
		const targetVal = result[key];
		const sourceVal = source[key];
		if (
			targetVal !== null &&
			sourceVal !== null &&
			typeof targetVal === 'object' &&
			typeof sourceVal === 'object' &&
			!Array.isArray(targetVal) &&
			!Array.isArray(sourceVal)
		) {
			result[key] = deepMerge(
				targetVal as Record<string, unknown>,
				sourceVal as Record<string, unknown>,
			);
		} else {
			result[key] = sourceVal;
		}
	}
	return result;
}

function parseAndValidate<T>(
	merged: Record<string, unknown>,
	options: ConfigOptions<T>,
): { config: T; warnings: string[] } {
	const warnings: string[] = [];

	const result = options.schema.safeParse(merged);
	if (!result.success) {
		const zodError = result.error as ZodError;
		for (const issue of zodError.issues) {
			warnings.push(`${issue.path.join('.')}: ${issue.message}`);
		}
	}

	// Re-parse with defaults to get the best possible config
	// If the merged data is invalid, fall back to defaults
	try {
		const config = options.schema.parse(merged);
		return { config, warnings };
	} catch {
		// If parse fails, try with just defaults
		const config = options.schema.parse(options.defaults ?? {});
		return { config, warnings };
	}
}

export function loadConfig<T>(options: ConfigOptions<T>): {
	config: T;
	warnings: string[];
} {
	let merged: Record<string, unknown> =
		(options.defaults as Record<string, unknown>) ?? {};

	if (options.global && existsSync(options.global)) {
		const globalData = readConfigFile(options.global);
		merged = deepMerge(merged, globalData);
	}

	if (options.local && existsSync(options.local)) {
		const localData = readConfigFile(options.local);
		merged = deepMerge(merged, localData);
	}

	return parseAndValidate(merged, options);
}

async function loadTsConfigFile(
	filePath: string,
): Promise<Record<string, unknown>> {
	const { createJiti } = await import('jiti');
	const jiti = createJiti(import.meta.url, { interopDefault: true });
	const mod = await jiti.import(filePath);
	const config = (mod as Record<string, unknown>).default ?? mod;
	return config as Record<string, unknown>;
}

export async function loadConfigAsync<T>(options: ConfigOptions<T>): Promise<{
	config: T;
	warnings: string[];
}> {
	let merged: Record<string, unknown> =
		(options.defaults as Record<string, unknown>) ?? {};

	for (const filePath of [options.global, options.local]) {
		if (!filePath || !existsSync(filePath)) continue;
		const data = isTsFile(filePath)
			? await loadTsConfigFile(filePath)
			: readConfigFile(filePath);
		merged = deepMerge(merged, data);
	}

	return parseAndValidate(merged, options);
}

export function saveConfig(filePath: string, config: unknown): void {
	const json = JSON.stringify(config, null, '\t');
	atomicWrite(filePath, json);
}
