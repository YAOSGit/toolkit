import type { Key } from 'ink';
import type { KeyBinding } from '../../types/commands.js';

const SPECIAL_KEY_MAP: Record<string, keyof Key> = {
	return: 'return',
	tab: 'tab',
	escape: 'escape',
	backspace: 'backspace',
	delete: 'delete',
	upArrow: 'upArrow',
	downArrow: 'downArrow',
	up: 'upArrow',
	down: 'downArrow',
};

export function isKeyMatch(
	key: Key,
	input: string,
	bindings: KeyBinding[],
): boolean {
	for (const binding of bindings) {
		if (binding.shift && !key.shift) continue;
		if (binding.ctrl && !key.ctrl) continue;
		if (binding.meta && !key.meta) continue;

		if (binding.leftArrow) {
			if (key.leftArrow) return true;
			continue;
		}

		if (binding.rightArrow) {
			if (key.rightArrow) return true;
			continue;
		}

		if (binding.specialKey) {
			const mapped = SPECIAL_KEY_MAP[binding.specialKey];
			if (mapped && key[mapped]) return true;
			continue;
		}

		if (binding.textKey) {
			if (input.toLowerCase() === binding.textKey.toLowerCase()) return true;
		}
	}

	return false;
}
