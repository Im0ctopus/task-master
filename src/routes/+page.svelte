<script lang="ts" module>
	export type Task = {
		id: number;
		name: string;
		urgency: string | null;
		status: Status;
		subTasks: SubTask[];
	};

	export type SubTask = Omit<Task, 'subTasks'>;
</script>

<script lang="ts">
	import TaskInput from '$lib/components/taskInput.svelte';
	import type { Status } from '$lib/types/status';
	import { bindManager } from '$lib/utils/bindManager';
	import { saveObjOnLocalStorage } from '$lib/utils/localStorageHelper';
	import { type Action } from '$lib/utils/actionsHelper';

	let tasks: Task[] = $state([]);
	let isTyping = $state(false);
	let selectedTask = $state(0);
	let selectedSubTask: null | number = $state(null);
	let openedTasks: number[] = $state([]);
	let action: null | Action = $state(null);

	let filteredTasks: Task[] = $derived(tasks);

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
		const newTasks: Task[] = [{ ...task, id, status: 'none', subTasks: [] }, ...tasks];
		tasks = newTasks;
		saveObjOnLocalStorage('tasks', newTasks);

		toggleIsTyping(false);
	};

	const editTask = (id: number, newTask: Pick<Task, 'name' | 'urgency'>) => {
		// TODO: edit what comes from the task
		// Attention to the urgency, it can be null but thats a "value"

		const taskIndex = tasks.findIndex((t) => t.id === id);
		if (taskIndex === -1) {
			console.error(`Task with id ${id} not found`);
			return;
		}

		const { name, urgency } = newTask;
		tasks[taskIndex] = { ...tasks[taskIndex], name, urgency };
		saveObjOnLocalStorage('tasks', tasks);

		action = null;
		toggleIsTyping(false);
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
		<TaskInput bind:inputRef {toggleIsTyping} {addTask} {editTask} {filteredTasks} bind:action />
	</div>
</div>
