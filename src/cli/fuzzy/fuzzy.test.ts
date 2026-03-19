import { fuzzyFilter, fuzzyScore } from './index.js';

describe('fuzzyScore', () => {
	it('returns 1000 for exact match', () => {
		expect(fuzzyScore('hello', 'hello')).toBe(1000);
	});

	it('returns 1000 for exact match (case insensitive)', () => {
		expect(fuzzyScore('Hello', 'hello')).toBe(1000);
	});

	it('returns 500+ for prefix match', () => {
		const score = fuzzyScore('hel', 'hello');
		expect(score).not.toBeNull();
		expect(score!).toBeGreaterThanOrEqual(500);
	});

	it('returns null when no match is possible', () => {
		expect(fuzzyScore('xyz', 'hello')).toBeNull();
	});

	it('gives word boundary bonus', () => {
		const boundaryScore = fuzzyScore('abc', 'a-big-cat');
		const noBoundaryScore = fuzzyScore('abc', 'axxbxxcxx');
		expect(boundaryScore).not.toBeNull();
		expect(noBoundaryScore).not.toBeNull();
		expect(boundaryScore!).toBeGreaterThan(noBoundaryScore!);
	});

	it('is case insensitive', () => {
		expect(fuzzyScore('ABC', 'abc')).toBe(1000);
	});

	it('returns all items when query is empty via fuzzyFilter', () => {
		const items = ['alpha', 'beta', 'gamma'];
		const result = fuzzyFilter('', items, (item) => item);
		expect(result).toEqual(items);
	});

	it('prefers shorter targets (length penalty)', () => {
		const shortScore = fuzzyScore('ab', 'ab-c');
		const longScore = fuzzyScore('ab', 'ab-something-very-long');
		expect(shortScore).not.toBeNull();
		expect(longScore).not.toBeNull();
		expect(shortScore!).toBeGreaterThan(longScore!);
	});
});

describe('fuzzyFilter', () => {
	it('sorts results by score descending', () => {
		const items = ['something-abc', 'abc', 'a-big-cat'];
		const result = fuzzyFilter('abc', items, (item) => item);
		// 'abc' is exact match (1000), should be first
		expect(result[0]).toBe('abc');
	});

	it('filters out non-matching items', () => {
		const items = ['abc', 'xyz', 'abxc'];
		const result = fuzzyFilter('abc', items, (item) => item);
		expect(result).toContain('abc');
		expect(result).not.toContain('xyz');
	});

	it('returns all items unchanged when query is empty', () => {
		const items = ['gamma', 'alpha', 'beta'];
		const result = fuzzyFilter('', items, (item) => item);
		expect(result).toEqual(['gamma', 'alpha', 'beta']);
	});
});
