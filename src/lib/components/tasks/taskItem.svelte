<script lang="ts">
	import { taskVariations } from '$lib/utils/taskVariations';
	import { urgencies } from '$lib/utils/urgencies';
	import { ChevronDown } from '@lucide/svelte';
	import type { Task } from '../../../routes/+page.svelte';
	import SubTasksList from './subTasks/subTasksList.svelte';

	type Props = {
		task: Task;
		index: number;
		isOpen: boolean;
		toggleOpen: (id: number) => void;
	};

	let { task, isOpen, toggleOpen, index }: Props = $props();

	let { id, name, status, subTasks, urgency } = $derived(task);
	let taskVariation = $derived(taskVariations[status]);
	let urgencyVariation = $derived(urgencies.find((u) => u.value === urgency));
</script>

<div class="w-full min-w-0 cursor-default rounded px-3 {taskVariation.className}">
	<div class="flex items-center justify-between gap-2 py-2.5">
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
		<div class="flex items-center justify-center gap-1">
			<button onclick={() => toggleOpen(id)}>
				<ChevronDown
					size="1.2rem"
					class="{!isOpen && 'rotate-180'} transition-[rotate] duration-150 ease-out"
				/>
			</button>
		</div>
	</div>
	<SubTasksList {subTasks} {isOpen} taskIndex={index} />
</div>
