import { Box } from 'ink';
import type React from 'react';
import type { BaseDeps, Command } from '../../types/commands.js';
import type { TUITheme } from '../../types/theme.js';
import { AppShell } from './AppShell.js';
import { CommandFooter } from './CommandFooter.js';
import { HelpMenu } from './HelpMenu.js';

type TUILayoutProps<TDeps extends BaseDeps<any>> = {
	/** Project name displayed in footer branding: "YAOSGit : {brand}" */
	brand: string;
	theme: TUITheme;
	commands: Command<TDeps>[];
	deps: TDeps;

	/** Help menu config — rendered automatically when activeOverlay === 'help' */
	helpTitle: string;
	helpSectionColors: Record<string, string>;

	/** Custom overlays beyond help — keyed by overlay name */
	overlays?: Record<string, () => React.ReactNode>;

	/** Header component rendered above the content area */
	header?: React.ReactNode;

	/** Status bar rendered between content and footer (hidden during confirmation) */
	statusBar?: React.ReactNode;

	/** Extra content inside the footer bar (e.g. progress stepper) */
	footerChildren?: React.ReactNode;

	/** Main content area */
	children: React.ReactNode;
};

export function TUILayout<TDeps extends BaseDeps<any>>({
	brand,
	theme,
	commands,
	deps,
	helpTitle,
	helpSectionColors,
	overlays,
	header,
	statusBar,
	footerChildren,
	children,
}: TUILayoutProps<TDeps>) {
	const activeOverlay = deps.ui.activeOverlay;
	const isConfirmation = activeOverlay === 'confirmation';
	const hasOverlay = activeOverlay !== 'none' && !isConfirmation;

	// Resolve which overlay to show
	let overlayContent: React.ReactNode = null;
	if (hasOverlay) {
		if (activeOverlay === 'help') {
			overlayContent = (
				<HelpMenu
					commands={commands}
					sectionColors={helpSectionColors}
					title={helpTitle}
					brandColor={theme.brand}
					onClose={() => deps.ui.setActiveOverlay('none')}
				/>
			);
		} else {
			const renderer = overlays?.[activeOverlay];
			if (renderer) {
				overlayContent = renderer();
			}
		}
	}

	return (
		<AppShell theme={theme} header={!overlayContent ? header : undefined}>
			{overlayContent ? (
				overlayContent
			) : (
				<>
					<Box flexDirection="column" flexGrow={1}>
						{children}
					</Box>
					{statusBar && !deps.ui.confirmation && (
						<Box paddingX={1}>{statusBar}</Box>
					)}
				</>
			)}
			<CommandFooter
				brand={brand}
				commands={commands}
				deps={deps}
				theme={theme}
			>
				{footerChildren}
			</CommandFooter>
		</AppShell>
	);
}
