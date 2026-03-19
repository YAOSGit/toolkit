import type { KeyBinding } from '../../types/commands.js';

/**
 * Whether the current platform is macOS.
 */
export const IS_MAC = process.platform === 'darwin';

/**
 * The display name for the platform modifier key.
 * macOS: "opt" | other: "Alt"
 */
export const MOD_KEY = IS_MAC ? 'opt' : 'Alt';

/**
 * Returns a display string like "opt\u00A0+\u00A0f" (macOS) or "Alt\u00A0+\u00A0f" (other).
 * Uses non-breaking spaces so the key hint doesn't wrap.
 */
export const modKey = (key: string): string =>
	`${MOD_KEY}\u00A0+\u00A0${key}`;

/**
 * Map of letter → composed Unicode character produced by Option+letter on macOS.
 * Only needed for keys that projects actually bind to.
 */
const DARWIN_OPT_CHARS: Record<string, string> = {
	b: '\u0180', // used by opt+← (ESC-b fallback)
	f: '\u0192', // ƒ — used by opt+→ (ESC-f fallback)
	m: '\u00B5', // µ
	p: '\u03C0', // π
};

/**
 * Returns key bindings for an opt/alt + letter command.
 *
 * On macOS, terminals handle Option+letter in two ways:
 *   1. **Composed character mode** (Terminal.app default): sends the Unicode
 *      composed character (e.g., opt+p → π) with no meta flag.
 *   2. **Esc+ mode** (iTerm2 "Option sends Esc+"): sends meta=true + plain letter.
 *
 * We return BOTH bindings on macOS so commands work regardless of terminal config.
 * On non-macOS, alt+letter always sends meta=true + plain letter.
 */
export const modKeyBindings = (letter: string): KeyBinding[] => {
	if (IS_MAC) {
		const composed = DARWIN_OPT_CHARS[letter];
		const bindings: KeyBinding[] = [
			// Esc+ mode (iTerm2, Alacritty with option_as_alt)
			{ textKey: letter, meta: true },
		];
		if (composed) {
			// Composed character mode (Terminal.app, default macOS)
			bindings.unshift({ textKey: composed, meta: false });
		}
		return bindings;
	}
	return [{ textKey: letter, meta: true }];
};
