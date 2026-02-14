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
	};

	let { task, index, taskIndex }: Props = $props();

	let { id, name, status, urgency } = $derived(task);
	let taskVariation = $derived(taskVariations[status]);
	let urgencyVariation = $derived(urgencies.find((u) => u.value === urgency));
	let { getSelectedTask }: TaskContext = getContext('taskContext');

	let selectedTask = $derived(getSelectedTask());
</script>

<div
	class="flex w-full min-w-0 cursor-default items-center justify-between gap-2 rounded px-3 py-2.5 {taskVariation.className} {selectedTask.taskIndex ===
		taskIndex &&
		selectedTask.subTaskIndex === index &&
		'outline outline-neutral-500'}"
>
	<div class="flex min-w-0 items-center justify-center gap-2">
		<p class="text-xs">
			{taskVariation.icon}
		</p>
		<p class="truncate text-neutral-200">
			{name}
		</p>
		{#if urgency}
			<p class="rounded px-2 py-0.5 text-sm capitalize {urgencyVariation?.className}">
				{urgency}
			</p>
		{/if}
	</div>
</div>
