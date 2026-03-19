import type { CLITheme } from '../../types/theme.js';
import { createLogger } from './index.js';

const mockTheme: CLITheme = {
	brand: (t: string) => `[brand:${t}]`,
	emphasis: (t: string) => `[emphasis:${t}]`,
	success: (t: string) => `[success:${t}]`,
	error: (t: string) => `[error:${t}]`,
	warning: (t: string) => `[warning:${t}]`,
	dim: (t: string) => `[dim:${t}]`,
};

describe('createLogger', () => {
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('info logs branded prefix and message via console.log', () => {
		const logger = createLogger({ prefix: 'app', theme: mockTheme });
		logger.info('hello');
		expect(logSpy).toHaveBeenCalledWith('[brand:[app]] hello');
	});

	it('success logs success-formatted prefix and message via console.log', () => {
		const logger = createLogger({ prefix: 'app', theme: mockTheme });
		logger.success('done');
		expect(logSpy).toHaveBeenCalledWith('[success:[app]] done');
	});

	it('warn logs warning-formatted prefix and message via console.error', () => {
		const logger = createLogger({ prefix: 'app', theme: mockTheme });
		logger.warn('careful');
		expect(errorSpy).toHaveBeenCalledWith('[warning:[app]] careful');
	});

	it('error logs error-formatted prefix and message via console.error', () => {
		const logger = createLogger({ prefix: 'app', theme: mockTheme });
		logger.error('boom');
		expect(errorSpy).toHaveBeenCalledWith('[error:[app]] boom');
	});

	it('verbose is silent when verbose is disabled', () => {
		const logger = createLogger({ prefix: 'app', theme: mockTheme });
		logger.verbose('debug info');
		expect(logSpy).not.toHaveBeenCalled();
	});

	it('verbose logs when verbose is enabled', () => {
		const logger = createLogger({ prefix: 'app', theme: mockTheme });
		logger.setVerbose(true);
		logger.verbose('debug info');
		expect(logSpy).toHaveBeenCalledWith('[dim:[app]] [dim:debug info]');
	});

	it('setVerbose toggles verbose behavior', () => {
		const logger = createLogger({ prefix: 'app', theme: mockTheme });

		logger.setVerbose(true);
		logger.verbose('first');
		expect(logSpy).toHaveBeenCalledTimes(1);

		logger.setVerbose(false);
		logger.verbose('second');
		expect(logSpy).toHaveBeenCalledTimes(1); // still 1, no new call
	});
});
