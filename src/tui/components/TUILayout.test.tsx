import { render } from 'ink-testing-library';
import { Text } from 'ink';
import type { BaseDeps } from '../../types/commands.js';
import type { TUITheme } from '../../types/theme.js';
import { TUILayout } from './TUILayout.js';

const theme: TUITheme = {
	brand: 'cyan',
	brandHex: '#00C4FF',
	focus: 'cyan',
	shell: 'blue',
	muted: 'gray',
	success: 'green',
	error: 'red',
	warning: 'yellow',
	info: 'cyan',
};

function makeDeps(overlay = 'none'): BaseDeps {
	return {
		ui: {
			activeOverlay: overlay,
			setActiveOverlay: vi.fn(),
			confirmation: null,
			requestConfirmation: vi.fn(),
			clearConfirmation: vi.fn(),
			cycleFocus: vi.fn(),
		},
		onQuit: vi.fn(),
	};
}

describe('TUILayout', () => {
	it('renders children in the content area', () => {
		const { lastFrame } = render(
			<TUILayout
				brand="test"
				theme={theme}
				commands={[]}
				deps={makeDeps()}
				helpTitle="Test Help"
				helpSectionColors={{}}
			>
				<Text>Main Content</Text>
			</TUILayout>,
		);
		expect(lastFrame() ?? '').toContain('Main Content');
	});

	it('renders branding in footer', () => {
		const { lastFrame } = render(
			<TUILayout
				brand="test"
				theme={theme}
				commands={[]}
				deps={makeDeps()}
				helpTitle="Test Help"
				helpSectionColors={{}}
			>
				<Text>Content</Text>
			</TUILayout>,
		);
		const frame = lastFrame() ?? '';
		expect(frame).toContain('YAOSGit');
		expect(frame).toContain('test');
	});

	it('renders help overlay when activeOverlay is help', () => {
		const { lastFrame } = render(
			<TUILayout
				brand="test"
				theme={theme}
				commands={[]}
				deps={makeDeps('help')}
				helpTitle="My Help Title"
				helpSectionColors={{}}
			>
				<Text>Should not appear</Text>
			</TUILayout>,
		);
		const frame = lastFrame() ?? '';
		expect(frame).toContain('My Help Title');
		expect(frame).not.toContain('Should not appear');
	});

	it('renders custom overlay when activeOverlay matches', () => {
		const { lastFrame } = render(
			<TUILayout
				brand="test"
				theme={theme}
				commands={[]}
				deps={makeDeps('jump')}
				helpTitle="Help"
				helpSectionColors={{}}
				overlays={{
					jump: () => <Text>Jump Overlay</Text>,
				}}
			>
				<Text>Main</Text>
			</TUILayout>,
		);
		const frame = lastFrame() ?? '';
		expect(frame).toContain('Jump Overlay');
		expect(frame).not.toContain('Main');
	});

	it('renders header above content', () => {
		const { lastFrame } = render(
			<TUILayout
				brand="test"
				theme={theme}
				commands={[]}
				deps={makeDeps()}
				helpTitle="Help"
				helpSectionColors={{}}
				header={<Text>Header Bar</Text>}
			>
				<Text>Content</Text>
			</TUILayout>,
		);
		expect(lastFrame() ?? '').toContain('Header Bar');
	});

	it('renders confirmation in footer', () => {
		const deps = makeDeps();
		deps.ui.confirmation = { message: 'Quit?', onConfirm: vi.fn() };
		deps.ui.activeOverlay = 'confirmation';

		const { lastFrame } = render(
			<TUILayout
				brand="test"
				theme={theme}
				commands={[]}
				deps={deps}
				helpTitle="Help"
				helpSectionColors={{}}
			>
				<Text>Content</Text>
			</TUILayout>,
		);
		const frame = lastFrame() ?? '';
		expect(frame).toContain('Quit?');
		expect(frame).toContain('y');
		expect(frame).toContain('n');
	});

	it('hides statusBar during confirmation', () => {
		const deps = makeDeps();
		deps.ui.confirmation = { message: 'Sure?', onConfirm: vi.fn() };

		const { lastFrame } = render(
			<TUILayout
				brand="test"
				theme={theme}
				commands={[]}
				deps={deps}
				helpTitle="Help"
				helpSectionColors={{}}
				statusBar={<Text>Status Message</Text>}
			>
				<Text>Content</Text>
			</TUILayout>,
		);
		expect(lastFrame() ?? '').not.toContain('Status Message');
	});

	it('renders footerChildren in footer bar', () => {
		const { lastFrame } = render(
			<TUILayout
				brand="test"
				theme={theme}
				commands={[]}
				deps={makeDeps()}
				helpTitle="Help"
				helpSectionColors={{}}
				footerChildren={<Text>● ○</Text>}
			>
				<Text>Content</Text>
			</TUILayout>,
		);
		expect(lastFrame() ?? '').toContain('● ○');
	});
});
