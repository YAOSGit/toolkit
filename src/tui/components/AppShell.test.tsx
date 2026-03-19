import { Text } from 'ink';
import { render } from 'ink-testing-library';
import { createTUITheme } from '../../theme/tui.js';
import { AppShell } from './AppShell.js';

const theme = createTUITheme('#00aaff');

describe('AppShell', () => {
	it('renders children inside the shell', () => {
		const { lastFrame } = render(
			<AppShell theme={theme}>
				<Text>Hello World</Text>
			</AppShell>,
		);
		expect(lastFrame()).toContain('Hello World');
	});

	it('has round border', () => {
		const { lastFrame } = render(
			<AppShell theme={theme}>
				<Text>content</Text>
			</AppShell>,
		);
		const frame = lastFrame()!;
		// Round border uses curved corner characters
		expect(frame).toContain('╭');
		expect(frame).toContain('╰');
	});
});
