import { type Key, useInput } from 'ink';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import type { BaseDeps, Command } from '../../types/commands.js';
import { isKeyMatch } from './keyMatch.js';
import {
	cycleFocusCommand,
	helpCommand,
	quitCommand,
	scrollDownCommand,
	scrollUpCommand,
} from './shared.js';

const CONFIRM_YES_KEYS = [{ textKey: 'y' }, { specialKey: 'return' }];
const CONFIRM_NO_KEYS = [{ textKey: 'n' }, { specialKey: 'escape' }];

export function createCommandsProvider<TDeps extends BaseDeps>(
	projectCommands: Command<TDeps>[],
) {
	const sharedCommands: Command<TDeps>[] = [
		helpCommand as Command<TDeps>,
		quitCommand as Command<TDeps>,
		scrollUpCommand as Command<TDeps>,
		scrollDownCommand as Command<TDeps>,
		cycleFocusCommand as Command<TDeps>,
	];

	// Deduplicate by ID — project commands take priority over shared ones
	const projectIds = new Set(projectCommands.map((c) => c.id));
	const COMMANDS: Command<TDeps>[] = [
		...projectCommands,
		...sharedCommands.filter((c) => !projectIds.has(c.id)),
	];

	type ContextValue = { commands: Command<TDeps>[]; deps: TDeps };
	const CommandsContext = createContext<ContextValue | null>(null);

	function CommandsProvider({
		deps,
		children,
	}: {
		deps: TDeps;
		children: React.ReactNode;
	}) {
		const pendingCommandRef = useRef<Command<TDeps> | null>(null);

		useInput((input: string, key: Key) => {
			// Confirmation mode
			if (deps.ui.confirmation) {
				// Confirm with y, Enter, or the same key that triggered
				if (
					isKeyMatch(key, input, CONFIRM_YES_KEYS) ||
					(pendingCommandRef.current &&
						isKeyMatch(key, input, pendingCommandRef.current.keys))
				) {
					deps.ui.confirmation.onConfirm();
					deps.ui.clearConfirmation();
					pendingCommandRef.current = null;
					return;
				}
				if (isKeyMatch(key, input, CONFIRM_NO_KEYS)) {
					deps.ui.clearConfirmation();
					pendingCommandRef.current = null;
					return;
				}
				// Ignore other keys during confirmation
				return;
			}

			// Escape dismisses overlays
			if (key.escape && deps.ui.activeOverlay !== 'none') {
				deps.ui.setActiveOverlay('none');
				return;
			}

			// When an overlay is open, skip commands — the overlay's own
			// useInput handles its keys (e.g. HelpMenu handles 'q' to close)
			if (deps.ui.activeOverlay !== 'none') {
				return;
			}

			for (const cmd of COMMANDS) {
				if (isKeyMatch(key, input, cmd.keys) && cmd.isEnabled(deps)) {
					// Check if command needs confirmation
					if (cmd.needsConfirmation?.(deps)) {
						const message =
							typeof cmd.confirmMessage === 'function'
								? cmd.confirmMessage(deps)
								: (cmd.confirmMessage ?? 'Are you sure?');
						pendingCommandRef.current = cmd;
						deps.ui.requestConfirmation(message, () =>
							cmd.execute(deps),
						);
						return;
					}
					cmd.execute(deps);
					return;
				}
			}
		});

		const value = useMemo(() => ({ commands: COMMANDS, deps }), [deps]);

		return (
			<CommandsContext.Provider value={value}>
				{children}
			</CommandsContext.Provider>
		);
	}

	function useCommands(): ContextValue {
		const ctx = useContext(CommandsContext);
		if (!ctx)
			throw new Error('useCommands must be used within CommandsProvider');
		return ctx;
	}

	return { CommandsProvider, useCommands, COMMANDS };
}
