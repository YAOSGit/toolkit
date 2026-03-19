import { Box, Text, useInput } from 'ink';
import type { BaseDeps, Command } from '../../types/commands.js';

export type HelpMenuProps<TDeps extends BaseDeps> = {
	commands: Command<TDeps>[];
	sectionColors: Record<string, string>;
	title: string;
	onClose: () => void;
	/** Brand color used for the border and title. Defaults to 'yellow'. */
	brandColor?: string;
};

export function HelpMenu<TDeps extends BaseDeps>({
	commands,
	sectionColors,
	title,
	onClose,
	brandColor = 'yellow',
}: HelpMenuProps<TDeps>) {
	useInput((input, key) => {
		if (key.escape || input === 'q' || input === 'h') onClose();
	});

	// Build sections from commands
	const sectionMap = new Map<string, Array<{ key: string; label: string }>>();
	for (const cmd of commands) {
		if (!cmd.helpSection || cmd.helpLabel === undefined) continue;
		if (!sectionMap.has(cmd.helpSection)) sectionMap.set(cmd.helpSection, []);
		sectionMap
			.get(cmd.helpSection)
			?.push({ key: cmd.displayKey, label: cmd.helpLabel ?? cmd.displayText });
	}

	const sections = Array.from(sectionMap.entries()).map(([name, rows]) => ({
		name,
		color: sectionColors[name] ?? 'white',
		rows,
	}));

	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor={brandColor}
			paddingX={2}
			paddingY={1}
		>
			<Box marginBottom={1} justifyContent="center">
				<Text bold color={brandColor}>
					{title}
				</Text>
			</Box>
			<Box flexDirection="row" gap={4} justifyContent="center">
				{sections.map((section, idx) => (
					<Box key={section.name} flexDirection="column" gap={1}>
						<Text bold underline color={section.color as any}>
							{section.name}
						</Text>
						{section.rows.map(({ key, label }) => (
							<Text key={key}>
								<Text bold>{key}</Text> : {label}
							</Text>
						))}
						{idx === sections.length - 1 && (
							<Box marginTop={1}>
								<Text dimColor>Press </Text>
								<Text bold>ESC</Text>
								<Text dimColor> or </Text>
								<Text bold>q</Text>
								<Text dimColor> to close</Text>
							</Box>
						)}
					</Box>
				))}
			</Box>
		</Box>
	);
}
