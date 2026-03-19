export const METHOD_COLORS: Record<string, string> = {
	GET: 'green',
	POST: 'yellow',
	PUT: 'blue',
	PATCH: 'cyan',
	DELETE: 'red',
	HEAD: 'gray',
	OPTIONS: 'gray',
};

export function statusColor(code: number): string {
	if (code >= 200 && code < 300) return 'green';
	if (code >= 300 && code < 400) return 'yellow';
	if (code >= 400 && code < 500) return 'red';
	if (code >= 500 && code < 600) return 'magenta';
	return 'gray';
}
