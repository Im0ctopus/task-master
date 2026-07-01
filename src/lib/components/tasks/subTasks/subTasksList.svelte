<script lang="ts">
	import type { SubTask } from '../../../../routes/+page.svelte';
	import SubTaskItem from './subTaskItem.svelte';

	type Props = {
		subTasks: SubTask[];
		isOpen: boolean;
		taskIndex: number;
	};

	let { subTasks, isOpen, taskIndex }: Props = $props();
</script>

{#key subTasks.length}
	<div
		class={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
	>
		<div class="overflow-hidden">
			<div class="px-1 pb-2.5">
				<p class="pb-1 text-xs text-neutral-500">Subtasks</p>
				<div class="flex flex-col items-center justify-center gap-2">
					{#each subTasks as task, index (task.id)}
						<SubTaskItem {task} {index} {taskIndex} />
					{/each}
				</div>
			</div>
		</div>
	</div>
{/key}
