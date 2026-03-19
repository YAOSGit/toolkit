import { Box, Text, useStdout } from 'ink';
import type React from 'react';
import type { BaseDeps, Command } from '../../types/commands.js';
import type { TUITheme } from '../../types/theme.js';

type CommandFooterProps<TDeps extends BaseDeps> = {
	brand: string;
	commands: Command<TDeps>[];
	deps: TDeps;
	theme: TUITheme;
	children?: React.ReactNode;
	width?: number;
};

type VisibleCmd = {
	id: string;
	displayKey: string;
	displayText: string;
	priority: boolean;
	footerOrder?: number;
};

function truncateToFit(
	cmds: VisibleCmd[],
	brandWidth: number,
	maxWidth: number,
): VisibleCmd[] {
	const priority = cmds.filter((c) => c.priority);
	const optional = cmds.filter((c) => !c.priority);
	const selected: VisibleCmd[] = [];
	let usedWidth = brandWidth;

	for (const cmd of priority) {
		const w = 3 + cmd.displayKey.length + 1 + cmd.displayText.length;
		selected.push(cmd);
		usedWidth += w;
	}

	for (const cmd of optional) {
		const w = 3 + cmd.displayKey.length + 1 + cmd.displayText.length;
		if (usedWidth + w <= maxWidth) {
			selected.push(cmd);
			usedWidth += w;
		} else {
			break;
		}
	}

	// Preserve original order
	return cmds.filter((c) => selected.includes(c));
}

export function CommandFooter<TDeps extends BaseDeps>({
	brand,
	commands,
	deps,
	theme,
	children,
	width,
}: CommandFooterProps<TDeps>) {
	const { stdout } = useStdout();
	const termWidth = width ?? stdout?.columns ?? 80;
	// border(2) + paddingX(2) + buffer(4)
	const availableWidth = termWidth - 8;
	// "YAOSGit" (7) + " : " (3) + brand
	const brandWidth = 10 + brand.length;

	// Confirmation replaces the entire footer
	if (deps.ui.confirmation) {
		return (
			<Box borderStyle="round" borderColor="yellow" paddingX={1} flexShrink={0}>
				<Text wrap="truncate">
					<Text bold color={theme.brand}>
						YAOSGit<Text dimColor> : </Text>
						{brand}
					</Text>
					<Text dimColor> │ </Text>
					<Text color="yellow" bold>
						{deps.ui.confirmation.message}
					</Text>
					<Text dimColor> </Text>
					<Text bold>y</Text>
					<Text dimColor>/</Text>
					<Text bold>n</Text>
				</Text>
			</Box>
		);
	}

	const visible: VisibleCmd[] = commands
		.filter((c) => c.footer !== 'hidden' && c.isEnabled(deps))
		.map((c) => ({
			id: c.id,
			displayKey: c.displayKey,
			displayText: c.displayText,
			priority: c.footer === 'priority',
			footerOrder: c.footerOrder,
		}));

	// Sort: priority first (by footerOrder), then optional (by footerOrder)
	const sorted = [
		...visible
			.filter((c) => c.priority)
			.sort((a, b) => (a.footerOrder ?? 999) - (b.footerOrder ?? 999)),
		...visible
			.filter((c) => !c.priority)
			.sort((a, b) => (a.footerOrder ?? 999) - (b.footerOrder ?? 999)),
	];

	const finalCommands = truncateToFit(sorted, brandWidth, availableWidth);

	return (
		<Box borderStyle="round" borderColor="gray" paddingX={1} flexShrink={0}>
			<Text wrap="truncate">
				<Text bold color={theme.brand}>
					YAOSGit<Text dimColor> : </Text>
					{brand}
				</Text>
				{children && (
					<>
						<Text dimColor> │ </Text>
						{children}
					</>
				)}
				{finalCommands.map((cmd) => (
					<Text key={cmd.id}>
						<Text dimColor> │ </Text>
						<Text bold>{cmd.displayKey}</Text> {cmd.displayText}
					</Text>
				))}
			</Text>
		</Box>
	);
}
