import { Text } from 'ink';
import { render } from 'ink-testing-library';
import type { TUITheme } from '../../types/theme.js';
import { SplitPane } from './SplitPane.js';

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

describe('SplitPane', () => {
	it('renders single child in a focusable pane', () => {
		const { lastFrame } = render(
			<SplitPane theme={theme}>
				<Text>Content</Text>
			</SplitPane>,
		);
		expect(lastFrame() ?? '').toContain('Content');
	});

	it('renders two children side by side', () => {
		const { lastFrame } = render(
			<SplitPane theme={theme} focusedIndex={0}>
				<Text>Left</Text>
				<Text>Right</Text>
			</SplitPane>,
		);
		const frame = lastFrame() ?? '';
		expect(frame).toContain('Left');
		expect(frame).toContain('Right');
	});

	it('renders two children in vertical direction', () => {
		const { lastFrame } = render(
			<SplitPane theme={theme} direction="vertical" focusedIndex={1}>
				<Text>Top</Text>
				<Text>Bottom</Text>
			</SplitPane>,
		);
		const frame = lastFrame() ?? '';
		expect(frame).toContain('Top');
		expect(frame).toContain('Bottom');
	});
});
