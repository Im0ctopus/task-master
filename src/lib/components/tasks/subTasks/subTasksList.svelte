<script lang="ts">
	import { getContext } from 'svelte';
	import type { SubTask } from '../../../../routes/+page.svelte';
	import type { Status } from '$lib/types/status';
	import SubTaskItem from './subTaskItem.svelte';

	type Props = {
		subTasks: SubTask[];
		isOpen: boolean;
		taskIndex: number;
	};

	let { subTasks, isOpen, taskIndex }: Props = $props();
	const getSelectedTab: () => Status = getContext('getSelectedTab');

	let animateOpen = $state();
	let render = $state(false);
	let subTaskListRef: HTMLElement | null = $state(null);

	let filteredSubTasks = $derived(subTasks.filter((t) => t.status === getSelectedTab()));

	$effect(() => {
		if (!isOpen) {
			animateOpen = false;
			return;
		}

		render = isOpen;
		const timeout = setTimeout(() => (animateOpen = true), 10);

		return () => {
			clearTimeout(timeout);
		};
	});
</script>

{#if render}
	{#key subTasks.length}
		<div
			class="overflow-hidden transition-[max-height] duration-300 ease-out"
			style="max-height: {animateOpen ? subTaskListRef?.scrollHeight : 0}px;"
			ontransitionend={() => {
				if (!isOpen) render = false;
			}}
		>
			<div bind:this={subTaskListRef} class="px-1 pb-2.5">
				<p class="pb-1 text-xs text-neutral-500">Subtasks</p>
				<div class="flex flex-col items-center justify-center gap-2">
					{#each filteredSubTasks as task, index (task.id)}
						<SubTaskItem {task} {index} {taskIndex} />
					{/each}
				</div>
			</div>
		</div>
	{/key}
{/if}
