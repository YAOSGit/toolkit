import { Box } from 'ink';
import type React from 'react';
import type { TUITheme } from '../../types/theme.js';

export function FocusablePane({
	focused,
	theme,
	children,
}: {
	focused: boolean;
	theme: TUITheme;
	children: React.ReactNode;
}) {
	return (
		<Box
			flexDirection="column"
			flexGrow={1}
			borderStyle="round"
			borderColor={focused ? theme.focus : theme.muted}
			paddingX={1}
			overflow="hidden"
		>
			{children}
		</Box>
	);
}
