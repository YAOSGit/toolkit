import { Box, useStdout } from 'ink';
import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import type { TUITheme } from '../../types/theme.js';

export type AppShellProps = {
	theme: TUITheme;
	/** Optional header rendered inside the border but before the padded content area (full width). */
	header?: React.ReactNode;
	children: React.ReactNode;
};

export function AppShell({ theme, header, children }: AppShellProps) {
	const { stdout } = useStdout();
	const mountedRef = useRef(true);
	const [size, setSize] = useState({
		width: stdout?.columns ?? 80,
		height: stdout?.rows ?? 24,
	});

	const onResize = useCallback(() => {
		if (!mountedRef.current || !stdout) return;
		setSize({ width: stdout.columns, height: stdout.rows });
	}, [stdout]);

	useEffect(() => {
		if (!stdout) return;
		stdout.on('resize', onResize);
		return () => {
			mountedRef.current = false;
			stdout.off('resize', onResize);
		};
	}, [stdout, onResize]);

	return (
		<Box
			flexDirection="column"
			width={size.width}
			height={size.height}
			borderStyle="round"
			borderColor={theme.shell}
		>
			{header && (
				<Box width="100%" flexShrink={0} paddingX={1}>
					{header}
				</Box>
			)}
			<Box flexDirection="column" flexGrow={1} paddingX={1}>
				{children}
			</Box>
		</Box>
	);
}
