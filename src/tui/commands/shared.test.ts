import type { BaseDeps } from '../../types/commands.js';
import type { OverlayState } from '../../types/overlay.js';
import {
	cycleFocusCommand,
	helpCommand,
	quitCommand,
	scrollDownCommand,
	scrollUpCommand,
} from './shared.js';

function makeDeps(overrides: Partial<{ activeOverlay: string }>): BaseDeps {
	const overlay: OverlayState = {
		activeOverlay: overrides.activeOverlay ?? 'none',
		setActiveOverlay: vi.fn(),
		confirmation: null,
		requestConfirmation: vi.fn(),
		clearConfirmation: vi.fn(),
	};
	return {
		ui: { ...overlay, cycleFocus: vi.fn() },
		onQuit: vi.fn(),
	};
}

describe('helpCommand', () => {
	it('has id HELP', () => {
		expect(helpCommand.id).toBe('HELP');
	});

	it('is enabled when no overlay is active', () => {
		const deps = makeDeps({ activeOverlay: 'none' });
		expect(helpCommand.isEnabled(deps)).toBe(true);
	});

	it('is disabled when an overlay is active', () => {
		const deps = makeDeps({ activeOverlay: 'help' });
		expect(helpCommand.isEnabled(deps)).toBe(false);
	});

	it('sets overlay to help on execute', () => {
		const deps = makeDeps({});
		helpCommand.execute(deps);
		expect(deps.ui.setActiveOverlay).toHaveBeenCalledWith('help');
	});

	it('has footer priority', () => {
		expect(helpCommand.footer).toBe('priority');
	});
});

describe('quitCommand', () => {
	it('has id QUIT', () => {
		expect(quitCommand.id).toBe('QUIT');
	});

	it('is enabled when no overlay is active', () => {
		const deps = makeDeps({ activeOverlay: 'none' });
		expect(quitCommand.isEnabled(deps)).toBe(true);
	});

	it('is disabled when an overlay is active', () => {
		const deps = makeDeps({ activeOverlay: 'help' });
		expect(quitCommand.isEnabled(deps)).toBe(false);
	});

	it('calls onQuit on execute', () => {
		const deps = makeDeps({});
		quitCommand.execute(deps);
		expect(deps.onQuit).toHaveBeenCalled();
	});

	it('needs confirmation', () => {
		const deps = makeDeps({});
		expect(quitCommand.needsConfirmation?.(deps)).toBe(true);
	});

	it('has Quit? confirm message', () => {
		expect(quitCommand.confirmMessage).toBe('Quit?');
	});

	it('has footer priority', () => {
		expect(quitCommand.footer).toBe('priority');
	});
});

describe('scrollUpCommand', () => {
	it('has id SCROLL_UP', () => {
		expect(scrollUpCommand.id).toBe('SCROLL_UP');
	});

	it('has empty keys', () => {
		expect(scrollUpCommand.keys).toEqual([]);
	});

	it('has hidden footer', () => {
		expect(scrollUpCommand.footer).toBe('hidden');
	});
});

describe('scrollDownCommand', () => {
	it('has id SCROLL_DOWN', () => {
		expect(scrollDownCommand.id).toBe('SCROLL_DOWN');
	});

	it('has empty keys', () => {
		expect(scrollDownCommand.keys).toEqual([]);
	});

	it('has hidden footer', () => {
		expect(scrollDownCommand.footer).toBe('hidden');
	});
});

describe('cycleFocusCommand', () => {
	it('has id CYCLE_FOCUS', () => {
		expect(cycleFocusCommand.id).toBe('CYCLE_FOCUS');
	});

	it('has empty keys', () => {
		expect(cycleFocusCommand.keys).toEqual([]);
	});

	it('has hidden footer', () => {
		expect(cycleFocusCommand.footer).toBe('hidden');
	});
});
