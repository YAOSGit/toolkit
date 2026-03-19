import { Text } from 'ink';

const ICONS: Record<string, { icon: string; color: string }> = {
	success: { icon: '✓', color: 'green' },
	error: { icon: '✗', color: 'red' },
	running: { icon: '⟳', color: 'yellow' },
	active: { icon: '●', color: 'green' },
	idle: { icon: '○', color: 'gray' },
};

export function StatusIcon({ status }: { status: string }) {
	const entry = ICONS[status] ?? ICONS.idle;
	return <Text color={entry.color as any}>{entry.icon}</Text>;
}
