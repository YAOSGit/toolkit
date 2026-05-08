import { parse as parseYaml } from 'yaml';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

// biome-ignore lint/suspicious/noExplicitAny: must accept any Zod version's safeParse result
type SchemaLike<T> = {
	safeParse(data: unknown): any;
};

export function parseFrontmatter<T>(
	raw: string,
	schema: SchemaLike<T>,
): { frontmatter: T; body: string } {
	const match = FRONTMATTER_RE.exec(raw);
	if (!match) {
		throw new Error('Missing YAML frontmatter');
	}

	const yamlStr = match[1] ?? '';
	const bodyStr = match[2] ?? '';

	const parsed = parseYaml(yamlStr) as unknown;
	const result = schema.safeParse(parsed);

	if (!result.success) {
		const messages = result.error.issues.map(
			(issue: { path: (string | number)[]; message: string }) =>
				`${issue.path.join('.')}: ${issue.message}`,
		);
		throw new Error(`Invalid frontmatter:\n${messages.join('\n')}`);
	}

	return { frontmatter: result.data, body: bodyStr.trim() };
}
