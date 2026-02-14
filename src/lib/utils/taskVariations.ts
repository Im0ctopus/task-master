import type { Status } from '$lib/types/status';

export const taskVariations: {
	[key in Status]: {
		className: string;
		icon: string;
	};
} = {
	none: { className: 'bg-neutral-700/30 text-neutral-600', icon: '-' },
	started: { className: 'bg-yellow-900/15 text-yellow-700', icon: ':' },
	canceled: { className: 'bg-red-900/20 text-red-700', icon: 'x' },
	done: { className: 'bg-green-900/10 text-green-700', icon: '#' }
};
