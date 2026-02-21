<script lang="ts">
	import type { Status } from '$lib/types/status';
	import type { Task } from '../../../routes/+page.svelte';
	import NoTasks from './noTasks.svelte';
	import TaskItem from './taskItem.svelte';

	type Props = {
		filteredTasks: Task[];
		openedTasks: number[];
		toggleTaskOpen: (id: number) => void;
		selectedTab: Status;
	};

	let { filteredTasks, openedTasks, toggleTaskOpen, selectedTab }: Props = $props();
</script>

<div class="relative h-full max-h-full w-full overflow-y-auto">
	{#if !filteredTasks.length}
		<NoTasks {selectedTab} />
	{:else}
		<div class="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-3 px-3 py-5">
			{#each filteredTasks as task, index (task.id)}
				<TaskItem {task} isOpen={openedTasks.includes(task.id)} {index} {toggleTaskOpen} />
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
