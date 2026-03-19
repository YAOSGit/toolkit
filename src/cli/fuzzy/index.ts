const WORD_BOUNDARY_CHARS = new Set(['-', '_', '/', ':', ' ']);

export function fuzzyScore(query: string, target: string): number | null {
	const q = query.toLowerCase();
	const t = target.toLowerCase();

	if (q === t) return 1000;

	if (t.startsWith(q)) {
		return 500 + (q.length / t.length) * 100;
	}

	let score = 0;
	let targetIndex = 0;
	let prevMatchIndex = -2; // -2 so first match is not "consecutive"

	for (let i = 0; i < q.length; i++) {
		const char = q[i];
		const foundIndex = t.indexOf(char, targetIndex);

		if (foundIndex === -1) return null;

		// Consecutive char bonus
		if (foundIndex === prevMatchIndex + 1) {
			score += 5;
		}

		// Word boundary bonus
		if (foundIndex > 0 && WORD_BOUNDARY_CHARS.has(t[foundIndex - 1])) {
			score += 10;
		}

		prevMatchIndex = foundIndex;
		targetIndex = foundIndex + 1;
	}

	// Length penalty: prefer shorter targets
	score -= t.length;

	return score;
}

export function fuzzyFilter<T>(
	query: string,
	items: T[],
	getText: (item: T) => string,
): T[] {
	if (query === '') return items;

	const scored: { item: T; score: number }[] = [];

	for (const item of items) {
		const score = fuzzyScore(query, getText(item));
		if (score !== null) {
			scored.push({ item, score });
		}
	}

	scored.sort((a, b) => b.score - a.score);

	return scored.map((s) => s.item);
}
