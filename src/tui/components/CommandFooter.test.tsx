import { render } from 'ink-testing-library';
import { createTUITheme } from '../../theme/tui.js';
import type { BaseDeps, Command } from '../../types/commands.js';
import { CommandFooter } from './CommandFooter.js';

const theme = createTUITheme('#00aaff');

const mockDeps: BaseDeps = {
	ui: {
		activeOverlay: 'none',
		setActiveOverlay: () => {},
		confirmation: null,
		requestConfirmation: () => {},
		clearConfirmation: () => {},
		cycleFocus: () => {},
	},
	onQuit: () => {},
};

const mockCommands: Command<BaseDeps>[] = [
	{
		id: 'quit',
		keys: [{ textKey: 'q' }],
		displayKey: 'q',
		displayText: 'Quit',
		footer: 'priority',
		isEnabled: () => true,
		execute: () => {},
	},
	{
		id: 'hidden-cmd',
		keys: [{ textKey: 'x' }],
		displayKey: 'x',
		displayText: 'Hidden',
		footer: 'hidden',
		isEnabled: () => true,
		execute: () => {},
	},
	{
		id: 'disabled-cmd',
		keys: [{ textKey: 'd' }],
		displayKey: 'd',
		displayText: 'Disabled',
		footer: 'optional',
		isEnabled: () => false,
		execute: () => {},
	},
];

describe('CommandFooter', () => {
	it('renders branding text', () => {
		const { lastFrame } = render(
			<CommandFooter
				brand="TestApp"
				commands={[]}
				deps={mockDeps}
				theme={theme}
			/>,
		);
		const frame = lastFrame()!;
		expect(frame).toContain('YAOSGit');
		expect(frame).toContain('TestApp');
	});

	it('shows enabled, non-hidden commands', () => {
		const { lastFrame } = render(
			<CommandFooter
				brand="App"
				commands={mockCommands}
				deps={mockDeps}
				theme={theme}
			/>,
		);
		const frame = lastFrame()!;
		expect(frame).toContain('Quit');
	});

	it('hides commands with footer=hidden', () => {
		const { lastFrame } = render(
			<CommandFooter
				brand="App"
				commands={mockCommands}
				deps={mockDeps}
				theme={theme}
			/>,
		);
		const frame = lastFrame()!;
		expect(frame).not.toContain('Hidden');
	});

	it('hides disabled commands', () => {
		const { lastFrame } = render(
			<CommandFooter
				brand="App"
				commands={mockCommands}
				deps={mockDeps}
				theme={theme}
			/>,
		);
		const frame = lastFrame()!;
		expect(frame).not.toContain('Disabled');
	});
});
