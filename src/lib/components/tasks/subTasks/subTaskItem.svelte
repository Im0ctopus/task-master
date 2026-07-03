<script lang="ts">
	import { taskVariations } from '$lib/utils/taskVariations';
	import { urgencies } from '$lib/utils/urgencies';
	import { getContext } from 'svelte';
	import type { SubTask } from '../../../../routes/+page.svelte';
	import type { TaskContext } from '$lib/types/taskContext';

	type Props = {
		task: SubTask;
		taskIndex: number;
		index: number;
		isFocused: boolean;
	};

	let { task, index, taskIndex, isFocused }: Props = $props();

	let { name, status, urgency, statusDate } = $derived(task);
	let taskVariation = $derived(taskVariations[status]);
	let urgencyVariation = $derived(urgencies.find((u) => u.value === urgency));

	let { getSelectedTask }: TaskContext = getContext('taskContext');
	let getShowIds: () => boolean = getContext('getShowIds');

	let selectedTask = $derived(isFocused ? getSelectedTask() : null);

	// svelte-ignore non_reactive_update
	let indexP: HTMLParagraphElement;
</script>

<div
	class="flex w-full min-w-0 cursor-default items-center justify-between gap-2 rounded px-3 py-2.5 {taskVariation.bgColor} {!!selectedTask &&
		selectedTask.taskIndex === taskIndex &&
		selectedTask.subTaskIndex === index &&
		'outline outline-neutral-500'}"
>
	<div class="flex w-full items-center justify-between gap-2">
		<div class="flex min-w-0 items-start justify-center gap-2">
			<div class="mt-1 flex items-center justify-center">
				<div
					style="width: {getShowIds() ? indexP?.offsetWidth + 5 : '0'}px;"
					class="overflow-hidden transition-[width] duration-150 ease-out"
				>
					<p bind:this={indexP} class="w-fit text-xs font-semibold text-neutral-400">
						{`${taskIndex + 1}.${index + 1}`}
					</p>
				</div>
				<p
					class="flex aspect-square min-h-0 w-4 items-center justify-center rounded text-sm {taskVariation.iconClass}"
				>
					{taskVariation.icon}
				</p>
			</div>
			<p>
				{name}
			</p>
			{#if urgency}
				<p class="rounded px-2 py-0.5 text-sm capitalize {urgencyVariation?.className}">
					{urgency}
				</p>
			{/if}
		</div>
		{#if statusDate}
			<p
				class="shrink-0 rounded bg-cyan-800/50 px-2 py-0.5 text-sm text-nowrap text-cyan-500 capitalize"
			>
				{new Date().toDateString() === new Date(statusDate).toDateString()
					? 'Today'
					: new Date(statusDate).toLocaleDateString(undefined, {
							month: 'short',
							day: 'numeric'
						})}
			</p>
		{/if}
	</div>
</div>
