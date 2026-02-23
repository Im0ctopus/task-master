import type { Status } from '$lib/types/status';

export const taskVariations: Record<
	Status,
	{
		bgColor: string;
		iconClass: string;
		icon: string;
	}
> = {
	none: { bgColor: 'bg-neutral-700/25', iconClass: 'text-neutral-200 bg-neutral-700', icon: '-' },
	started: { bgColor: 'bg-yellow-900/25', iconClass: 'text-yellow-500 bg-yellow-900', icon: ':' },
	blocked: { bgColor: 'bg-mauve-800/25', iconClass: 'text-mauve-500 bg-mauve-800', icon: '0' },
	canceled: { bgColor: 'bg-red-900/25', iconClass: 'text-red-400 bg-red-900', icon: 'x' },
	done: { bgColor: 'bg-green-900/25', iconClass: 'text-green-500 bg-green-900', icon: '#' }
};
