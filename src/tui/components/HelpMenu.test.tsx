import { render } from 'ink-testing-library';
import type { BaseDeps, Command } from '../../types/commands.js';
import { HelpMenu } from './HelpMenu.js';

const mockCommands: Command<BaseDeps>[] = [
	{
		id: 'quit',
		keys: [{ textKey: 'q' }],
		displayKey: 'q',
		displayText: 'Quit',
		helpSection: 'General',
		helpLabel: 'Quit the app',
		footer: 'priority',
		isEnabled: () => true,
		execute: () => {},
	},
	{
		id: 'help',
		keys: [{ textKey: 'h' }],
		displayKey: 'h',
		displayText: 'Help',
		helpSection: 'General',
		helpLabel: 'Show help',
		footer: 'priority',
		isEnabled: () => true,
		execute: () => {},
	},
	{
		id: 'refresh',
		keys: [{ textKey: 'r' }],
		displayKey: 'r',
		displayText: 'Refresh',
		helpSection: 'Actions',
		helpLabel: 'Refresh data',
		footer: 'optional',
		isEnabled: () => true,
		execute: () => {},
	},
];

const sectionColors: Record<string, string> = {
	General: 'cyan',
	Actions: 'green',
};

describe('HelpMenu', () => {
	it('renders the title', () => {
		const { lastFrame } = render(
			<HelpMenu
				commands={mockCommands}
				sectionColors={sectionColors}
				title="Test Help"
				onClose={() => {}}
			/>,
		);
		expect(lastFrame()).toContain('Test Help');
	});

	it('renders section names', () => {
		const { lastFrame } = render(
			<HelpMenu
				commands={mockCommands}
				sectionColors={sectionColors}
				title="Help"
				onClose={() => {}}
			/>,
		);
		const frame = lastFrame()!;
		expect(frame).toContain('General');
		expect(frame).toContain('Actions');
	});

	it('renders command keys and labels', () => {
		const { lastFrame } = render(
			<HelpMenu
				commands={mockCommands}
				sectionColors={sectionColors}
				title="Help"
				onClose={() => {}}
			/>,
		);
		const frame = lastFrame()!;
		expect(frame).toContain('Quit the app');
		expect(frame).toContain('Refresh data');
	});

	it('calls onClose when q is pressed', () => {
		const onClose = vi.fn();
		const { stdin } = render(
			<HelpMenu
				commands={mockCommands}
				sectionColors={sectionColors}
				title="Help"
				onClose={onClose}
			/>,
		);
		stdin.write('q');
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
