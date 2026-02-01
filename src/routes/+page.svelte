<script lang="ts" module>
	export type Tasks = {
		[key: number]: Task;
	};

	export type Task = {};
</script>

<script lang="ts">
	import TaskInput from '$lib/components/taskInput.svelte';
	import { bindManager } from '$lib/utils/bindManager';

	let tasks: Tasks = $state({});
	let isTyping = $state(false);
	let selectedTask = $state(0);
	let selectedSubTask: null | number = $state(null);
	let openedTasks: number[] = $state([]);

	let inputRef: HTMLTextAreaElement;

	$effect(() => {
		if (!isTyping) document.addEventListener('keydown', bindHandler);

		return () => {
			document.removeEventListener('keydown', bindHandler);
		};
	});

	let bindHandler = (e: KeyboardEvent) => {
		bindManager(e, toggleIsTyping);
	};

	let toggleIsTyping = (val: boolean) => {
		isTyping = val;
		val ? inputRef.focus() : inputRef.blur();
	};
</script>

<div class="flex h-screen w-full flex-col items-center justify-between font-main">
	<p>
		{isTyping}
	</p>

	<div class="w-full max-w-4xl px-3 lg:px-0">
		<TaskInput bind:inputRef {toggleIsTyping} />
	</div>
</div>
