import { z } from 'zod';
import { parseFrontmatter } from './index.js';

describe('parseFrontmatter', () => {
	type FrontMatter = { title: string; tags?: string[] };
	const schema = z.object({
		title: z.string(),
		tags: z.array(z.string()).optional(),
	});

	it('parses valid frontmatter and body', () => {
		const raw =
			'---\ntitle: Hello\ntags:\n  - foo\n  - bar\n---\nThis is the body.';
		const { frontmatter, body } = parseFrontmatter<FrontMatter>(raw, schema);
		expect(frontmatter.title).toBe('Hello');
		expect(frontmatter.tags).toEqual(['foo', 'bar']);
		expect(body).toBe('This is the body.');
	});

	it('throws on missing frontmatter delimiters', () => {
		const raw = 'No frontmatter here.';
		expect(() => parseFrontmatter(raw, schema)).toThrow(
			'Missing YAML frontmatter',
		);
	});

	it('throws on invalid schema with formatted errors', () => {
		const raw = '---\ntitle: 123\n---\nBody text.';
		expect(() => parseFrontmatter(raw, schema)).toThrow();
	});

	it('extracts body correctly with multiple paragraphs', () => {
		const raw = '---\ntitle: Test\n---\nParagraph one.\n\nParagraph two.';
		const { body } = parseFrontmatter(raw, schema);
		expect(body).toBe('Paragraph one.\n\nParagraph two.');
	});

	it('handles empty body', () => {
		const raw = '---\ntitle: Empty\n---\n';
		const { frontmatter, body } = parseFrontmatter<FrontMatter>(raw, schema);
		expect(frontmatter.title).toBe('Empty');
		expect(body).toBe('');
	});
});
