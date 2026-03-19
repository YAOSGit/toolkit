import { render } from 'ink-testing-library';
import { StatusIcon } from './StatusIcon.js';

describe('StatusIcon', () => {
	it('renders success icon', () => {
		const { lastFrame } = render(<StatusIcon status="success" />);
		expect(lastFrame()).toContain('✓');
	});

	it('renders error icon', () => {
		const { lastFrame } = render(<StatusIcon status="error" />);
		expect(lastFrame()).toContain('✗');
	});

	it('renders running icon', () => {
		const { lastFrame } = render(<StatusIcon status="running" />);
		expect(lastFrame()).toContain('⟳');
	});

	it('renders active icon', () => {
		const { lastFrame } = render(<StatusIcon status="active" />);
		expect(lastFrame()).toContain('●');
	});

	it('renders idle icon', () => {
		const { lastFrame } = render(<StatusIcon status="idle" />);
		expect(lastFrame()).toContain('○');
	});

	it('falls back to idle for unknown status', () => {
		const { lastFrame } = render(<StatusIcon status="unknown" />);
		expect(lastFrame()).toContain('○');
	});
});
