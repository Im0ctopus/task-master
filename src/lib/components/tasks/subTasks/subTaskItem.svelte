<script lang="ts">
	import { taskVariations } from '$lib/utils/taskVariations';
	import { urgencies } from '$lib/utils/urgencies';
	import type { SubTask } from '../../../../routes/+page.svelte';

	type Props = {
		task: SubTask;
		taskIndex: number;
		index: number;
	};

	let { task, index, taskIndex }: Props = $props();

	let { id, name, status, urgency } = $derived(task);
	let taskVariation = $derived(taskVariations[status]);
	let urgencyVariation = $derived(urgencies.find((u) => u.value === urgency));
</script>

<div
	class="flex w-full min-w-0 cursor-default items-center justify-between gap-2 rounded px-3 py-2.5 {taskVariation.className}"
>
	<div class="flex min-w-0 items-center justify-center gap-2">
		<p class="text-xs text-neutral-600">
			{taskVariation.icon}
		</p>
		<p class="truncate">
			{name}
		</p>
		{#if urgency}
			<p class="rounded px-2 py-0.5 text-sm capitalize {urgencyVariation?.className}">
				{urgency}
			</p>
		{/if}
	</div>
</div>
