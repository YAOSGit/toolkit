export type ScrollState = {
	offset: number;
	setOffset: (offset: number) => void;
	scrollBy: (delta: number) => void;
	scrollTo: (index: number) => void;
	autoScroll: boolean;
	setAutoScroll: (enabled: boolean) => void;
};
