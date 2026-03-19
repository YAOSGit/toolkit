import type { KeyBinding } from '../../types/commands.js';
import { MOD_KEY } from './platform.js';

const SPECIAL_KEY_DISPLAY: Record<string, string> = {
	return: '\u21B5',
	tab: 'Tab',
	escape: 'Esc',
	backspace: '\u232B',
	delete: 'Del',
	upArrow: '\u2191',
	downArrow: '\u2193',
	up: '\u2191',
	down: '\u2193',
	leftArrow: '\u2190',
	rightArrow: '\u2192',
};

export function getDisplayKey(keys: KeyBinding[]): string {
	return keys
		.map((binding) => {
			let display = '';

			if (binding.ctrl) display += 'Ctrl\u00A0+\u00A0';
			if (binding.shift) display += 'Shift\u00A0+\u00A0';
			if (binding.meta) display += `${MOD_KEY}\u00A0+\u00A0`;

			if (binding.specialKey) {
				display +=
					SPECIAL_KEY_DISPLAY[binding.specialKey] ?? binding.specialKey;
			} else if (binding.textKey) {
				display += binding.textKey;
			} else if (binding.leftArrow) {
				display += '\u2190';
			} else if (binding.rightArrow) {
				display += '\u2192';
			}

			return display;
		})
		.join(' / ');
}
