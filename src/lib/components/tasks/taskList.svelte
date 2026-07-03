<script lang="ts">
	import type { Status } from '$lib/types/status';
	import type { Task } from '$lib/types/tasks';
	import NoTasks from './noTasks.svelte';
	import TaskItem from './taskItem.svelte';

	type Props = {
		filteredTasks: Task[];
		openedTasks: number[];
		selectedTab: Status;
		isFocused: boolean;
	};

	let { filteredTasks, openedTasks, selectedTab, isFocused }: Props = $props();

	let listRef: HTMLDivElement | null = $state(null);

	const scrollToTask = (top: number, bottom: number) => {
		// FIXME: Not working for subTasks
		if (!listRef) return;

		const listHeight = listRef.clientHeight;
		const scrollTop = listRef.scrollTop;
		const itemHeight = bottom - top;

		if (
			(scrollTop + 20 < top && scrollTop + listHeight - 20 > bottom) ||
			(itemHeight > listHeight && scrollTop + 20 < top)
		)
			return;

		listRef.scrollTo({
			top: scrollTop > top ? top - 20 : top - listHeight + itemHeight + 20,
			behavior: 'smooth'
		});
	};
</script>

<div bind:this={listRef} class="max-h-full min-w-0 flex-1 overflow-y-auto">
	{#if !filteredTasks.length}
		<NoTasks {selectedTab} />
	{:else}
		<div
			class="full flex flex-1 scrollbar-thin flex-col items-center justify-center gap-3 px-4 py-5"
		>
			{#each filteredTasks as task, index (task.id)}
				<TaskItem
					{task}
					isOpen={openedTasks.includes(task.id)}
					{index}
					{scrollToTask}
					{isFocused}
				/>
			{/each}
		</div>
	{/if}
</div>

<!-- "scroll overlay" -->
<div
	class="absolute inset-x-0 top-0 mx-auto h-4 max-w-4xl bg-linear-to-b from-neutral-900 to-transparent"
></div>
<div
	class="absolute inset-x-0 bottom-0 mx-auto h-4 max-w-4xl bg-linear-to-t from-neutral-900 to-transparent"
></div>
