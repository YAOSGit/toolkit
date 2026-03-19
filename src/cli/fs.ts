import { renameSync, writeFileSync } from 'node:fs';

export function atomicWrite(filePath: string, content: string): void {
	const tempPath = `${filePath}.${Date.now()}.tmp`;
	writeFileSync(tempPath, content);
	renameSync(tempPath, filePath);
}
