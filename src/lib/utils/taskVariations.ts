import type { Status } from '$lib/types/status';

export const taskVariations: {
	[key in Status]: {
		className: string;
		icon: string;
	};
} = {
	none: { className: 'bg-neutral-700/30', icon: '-' },
	started: { className: '', icon: '' },
	canceled: { className: '', icon: '' },
	done: { className: '', icon: '' }
};
