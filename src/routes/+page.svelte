<script lang="ts" module>
	export type Task = {
		id: number;
		name: string;
		urgency: string | null;
		status: Status;
		subTasks: Omit<Task, 'subTasks'>[];
	};
</script>

<script lang="ts">
	import TaskInput from '$lib/components/taskInput.svelte';
	import type { Status } from '$lib/types/status';
	import { bindManager } from '$lib/utils/bindManager';
	import { saveObjOnLocalStorage } from '$lib/utils/localStorageHelper';

	let tasks: Task[] = $state([]);
	let isTyping = $state(false);
	let selectedTask = $state(0);
	let selectedSubTask: null | number = $state(null);
	let openedTasks: number[] = $state([]);

	// svelte-ignore non_reactive_update
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

	const addTask = (task: Pick<Task, 'name' | 'urgency'>) => {
		const id = !tasks.length ? 1 : tasks.sort((a, b) => b.id - a.id)[0].id + 1;

		tasks.push({ ...task, id, status: 'none', subTasks: [] });
		saveObjOnLocalStorage('tasks', tasks);

		toggleIsTyping(false);
	};

	const editTask = (id: number, task: Partial<Omit<Task, 'id' | 'subTasks'>>) => {
		// TODO: edit what comes from the task
		// Attention to the status, it can be null but thats a "value"
	};

	const addSubTask = (taskId: number, subTask: Pick<Task, 'name' | 'urgency'>) => {
		// TODO:
	};

	const editSubTask = (
		taskId: number,
		subTaskId: number,
		subTask: Pick<Task, 'name' | 'urgency'>
	) => {
		// TODO:
	};
</script>

<div class="flex h-screen w-full flex-col items-center justify-between font-main">
	<p>
		{isTyping}
	</p>

	<div class="w-full max-w-4xl px-3 lg:px-0">
		<TaskInput bind:inputRef {toggleIsTyping} {addTask} />
	</div>
</div>
