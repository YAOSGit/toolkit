import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { atomicWrite } from './fs.js';

describe('atomicWrite', () => {
	let tempDir: string;

	beforeEach(() => {
		tempDir = mkdtempSync(join(tmpdir(), 'toolkit-fs-test-'));
	});

	it('writes content to the specified file', () => {
		const filePath = join(tempDir, 'test.txt');
		atomicWrite(filePath, 'hello world');
		expect(readFileSync(filePath, 'utf-8')).toBe('hello world');
	});

	it('overwrites an existing file', () => {
		const filePath = join(tempDir, 'overwrite.txt');
		atomicWrite(filePath, 'first');
		atomicWrite(filePath, 'second');
		expect(readFileSync(filePath, 'utf-8')).toBe('second');
	});

	it('does not leave temporary files behind', () => {
		const filePath = join(tempDir, 'clean.txt');
		atomicWrite(filePath, 'data');
		const files = require('node:fs').readdirSync(tempDir) as string[];
		const tmpFiles = files.filter((f: string) => f.endsWith('.tmp'));
		expect(tmpFiles).toHaveLength(0);
	});

	it('writes empty string without error', () => {
		const filePath = join(tempDir, 'empty.txt');
		atomicWrite(filePath, '');
		expect(readFileSync(filePath, 'utf-8')).toBe('');
	});

	it('writes unicode content correctly', () => {
		const filePath = join(tempDir, 'unicode.txt');
		const content = 'Hola mundo. Caf\u00e9.';
		atomicWrite(filePath, content);
		expect(readFileSync(filePath, 'utf-8')).toBe(content);
	});
});
