<script lang="ts">
	import { taskVariations } from '$lib/utils/taskVariations';
	import { urgencies } from '$lib/utils/urgencies';
	import { ChevronDown } from '@lucide/svelte';
	import type { Task } from '../../../routes/+page.svelte';
	import SubTasksList from './subTasks/subTasksList.svelte';
	import { getContext } from 'svelte';
	import type { TaskContext } from '$lib/types/taskContext';
	import { stopFocus } from '$lib/utils/stopFocus';

	type Props = {
		task: Task;
		index: number;
		isOpen: boolean;
		toggleTaskOpen: (id: number) => void;
	};

	let { task, isOpen, toggleTaskOpen, index }: Props = $props();

	let { getSelectedTask }: TaskContext = getContext('taskContext');
	let getShowIds: () => boolean = getContext('getShowIds');

	let selectedTask = $derived(getSelectedTask());
	let { id, name, status, subTasks, urgency, statusDate } = $derived(task);
	let taskVariation = $derived(taskVariations[status]);
	let urgencyVariation = $derived(urgencies.find((u) => u.value === urgency));

	// svelte-ignore non_reactive_update
	let indexP: HTMLParagraphElement;
</script>

<div
	class="w-full min-w-0 cursor-default rounded px-3 {taskVariation.bgColor} {selectedTask.taskIndex ===
		index &&
		(selectedTask.subTaskIndex === undefined
			? 'outline outline-neutral-500'
			: 'outline outline-neutral-700')}"
>
	<div class="flex items-center justify-between gap-2 py-2.5">
		<div class="flex min-w-0 items-center justify-center gap-2">
			<div class="flex items-center justify-center">
				<div
					style="width: {getShowIds() ? indexP?.offsetWidth + 5 : '0'}px;"
					class="overflow-hidden transition-[width] duration-150 ease-out"
				>
					<p bind:this={indexP} class="w-fit text-xs font-semibold text-neutral-400">
						{index + 1}
					</p>
				</div>
				<p
					class="flex aspect-square min-h-0 w-4 items-center justify-center rounded text-sm {taskVariation.iconClass}"
				>
					{taskVariation.icon}
				</p>
			</div>
			<p class="truncate">
				{name}
			</p>
			{#if urgency}
				<p class="rounded px-2 py-0.5 text-sm capitalize {urgencyVariation?.className}">
					{urgency}
				</p>
			{/if}
		</div>
		<div class="flex items-center justify-center gap-1">
			{#if statusDate}
				<p class="rounded bg-cyan-800/50 px-2 py-0.5 text-sm text-cyan-500 capitalize">
					{new Date().toDateString() === new Date(statusDate).toDateString()
						? 'Today'
						: new Date(statusDate).toLocaleDateString(undefined, {
								month: 'short',
								day: 'numeric'
							})}
				</p>
			{/if}
			<button
				onfocus={stopFocus}
				onclick={() => toggleTaskOpen(id)}
				disabled={!subTasks.length}
				class="p-0.5"
			>
				<ChevronDown
					size="1.2rem"
					class="{!isOpen &&
						'rotate-180'} transition-[rotate] duration-150 ease-out {!subTasks.length &&
						'opacity-20'}"
				/>
			</button>
		</div>
	</div>
	{#if subTasks.length}
		<SubTasksList {subTasks} {isOpen} taskIndex={index} />
	{/if}
</div>
