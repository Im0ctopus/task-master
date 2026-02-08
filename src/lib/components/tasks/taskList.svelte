<script lang="ts">
	import type { Task } from '../../../routes/+page.svelte';
	import TaskItem from './taskItem.svelte';

	type Props = {
		filteredTasks: Task[];
	};

	let { filteredTasks }: Props = $props();
</script>

<div class="relative max-h-full w-full overflow-y-auto">
	<div class="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-3 px-3 py-5">
		{#each filteredTasks as { id, ...task } (id)}
			<TaskItem {task} />
		{/each}
	</div>
</div>

<div
	class="absolute inset-x-0 top-0 mx-auto h-4 max-w-4xl bg-linear-to-b from-neutral-900 to-transparent"
></div>
<div
	class="absolute inset-x-0 bottom-0 mx-auto h-4 max-w-4xl bg-linear-to-t from-neutral-900 to-transparent"
></div>
