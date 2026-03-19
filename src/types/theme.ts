export type TUITheme = {
	brand: string;
	brandHex: string;
	focus: string;
	shell: string;
	muted: string;
	success: string;
	error: string;
	warning: string;
	info: string;
};

export type CLITheme = {
	brand: (text: string) => string;
	emphasis: (text: string) => string;
	success: (text: string) => string;
	error: (text: string) => string;
	warning: (text: string) => string;
	dim: (text: string) => string;
};
