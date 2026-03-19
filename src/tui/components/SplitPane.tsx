import { Box } from 'ink';
import type React from 'react';
import type { TUITheme } from '../../types/theme.js';
import { FocusablePane } from './FocusablePane.js';

type SplitPaneProps = {
	direction?: 'horizontal' | 'vertical';
	ratio?: [number, number];
	/** Which pane has focus (0 or 1). Controls FocusablePane border color. */
	focusedIndex?: number;
	theme: TUITheme;
	/** Per-pane border control. [true, true] = both bordered, [true, false] = only left. Default: both. */
	borders?: [boolean, boolean];
	children: React.ReactNode;
};

function PaneWrapper({
	bordered,
	focused,
	theme,
	children,
}: {
	bordered: boolean;
	focused: boolean;
	theme: TUITheme;
	children: React.ReactNode;
}) {
	if (bordered) {
		return (
			<FocusablePane focused={focused} theme={theme}>
				{children}
			</FocusablePane>
		);
	}
	return (
		<Box flexDirection="column" flexGrow={1}>
			{children}
		</Box>
	);
}

export function SplitPane({
	direction = 'horizontal',
	ratio = [50, 50],
	focusedIndex = 0,
	theme,
	borders = [true, true],
	children,
}: SplitPaneProps) {
	const childArray = Array.isArray(children)
		? (children as React.ReactNode[]).filter(Boolean)
		: [children];

	if (childArray.length === 1) {
		return (
			<PaneWrapper bordered={borders[0]} focused={true} theme={theme}>
				{childArray[0]}
			</PaneWrapper>
		);
	}

	const flexDir = direction === 'horizontal' ? 'row' : 'column';
	const sizeKey = direction === 'horizontal' ? 'width' : 'height';

	return (
		<Box flexDirection={flexDir} flexGrow={1}>
			<Box {...{ [sizeKey]: `${ratio[0]}%` }} flexDirection="column">
				<PaneWrapper bordered={borders[0]} focused={focusedIndex === 0} theme={theme}>
					{childArray[0]}
				</PaneWrapper>
			</Box>
			<Box {...{ [sizeKey]: `${ratio[1]}%` }} flexDirection="column">
				<PaneWrapper bordered={borders[1]} focused={focusedIndex === 1} theme={theme}>
					{childArray[1]}
				</PaneWrapper>
			</Box>
		</Box>
	);
}
