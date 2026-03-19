import { Text } from 'ink';
import { render } from 'ink-testing-library';
import { createTUITheme } from '../../theme/tui.js';
import { FocusablePane } from './FocusablePane.js';

const theme = createTUITheme('#00aaff');

describe('FocusablePane', () => {
	it('renders children when focused', () => {
		const { lastFrame } = render(
			<FocusablePane focused={true} theme={theme}>
				<Text>Focused Content</Text>
			</FocusablePane>,
		);
		expect(lastFrame()).toContain('Focused Content');
	});

	it('renders children when unfocused', () => {
		const { lastFrame } = render(
			<FocusablePane focused={false} theme={theme}>
				<Text>Unfocused Content</Text>
			</FocusablePane>,
		);
		expect(lastFrame()).toContain('Unfocused Content');
	});

	it('has round border in both states', () => {
		const { lastFrame: focusedFrame } = render(
			<FocusablePane focused={true} theme={theme}>
				<Text>A</Text>
			</FocusablePane>,
		);
		const { lastFrame: unfocusedFrame } = render(
			<FocusablePane focused={false} theme={theme}>
				<Text>B</Text>
			</FocusablePane>,
		);
		expect(focusedFrame()).toContain('╭');
		expect(unfocusedFrame()).toContain('╭');
	});
});
