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
	import { bindManager, type BindActions } from '$lib/utils/bindManager';
	import { getObjFromLocalStorage, saveObjOnLocalStorage } from '$lib/utils/localStorageHelper';
	import { type Action } from '$lib/utils/actionsHelper';
	import TabSelector, { type Tab } from '$lib/components/tabSelector/tabSelector.svelte';
	import TaskList from '$lib/components/tasks/taskList.svelte';
	import { onMount } from 'svelte';

	let tasks: Task[] = $state([]);
	let isTyping = $state(false);
	let selectedTask = $state(0);
	let selectedSubTask: null | number = $state(null);
	let openedTasks: number[] = $state([]);
	let action: null | Action = $state(null);
	let selectedTab: Tab = $state('workingOn');

	let currentId: number = 0;

	let filteredTasks: Task[] = $derived(tasks);

	// svelte-ignore non_reactive_update
	let inputRef: HTMLTextAreaElement;

	onMount(() => {
		const storedTasks = getObjFromLocalStorage('tasks');
		if (!storedTasks) return;
		tasks = storedTasks;
		if (storedTasks && storedTasks.length)
			currentId = currentId = Math.max(...tasks.map((t) => t.id));
	});

	$effect(() => {
		if (!isTyping) document.addEventListener('keydown', bindHandler);

		return () => {
			document.removeEventListener('keydown', bindHandler);
		};
	});

	let bindHandler = (e: KeyboardEvent) => {
		const actions: BindActions = {
			toggleIsTyping,
			onTabChange
		};

		bindManager(e, actions);
	};

	let toggleIsTyping = (val: boolean) => {
		isTyping = val;
		val ? inputRef.focus() : inputRef.blur();
	};

	let onTabChange = (tab: Tab) => (selectedTab = tab);

	const addTask = (task: Pick<Task, 'name' | 'urgency'>) => {
		const id = ++currentId;
		const newTasks: Task[] = [...tasks, { ...task, id, status: 'none', subTasks: [] }];
		tasks = newTasks;
		saveObjOnLocalStorage('tasks', newTasks);

		toggleIsTyping(false);
	};

	const editTask = (id: number, newTask: Pick<Task, 'name' | 'urgency'>) => {
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

<div class="flex h-screen w-full flex-col items-center justify-start overflow-clip font-main">
	<TabSelector bind:selectedTab />
	<div class="relative min-h-0 w-full grow">
		<TaskList {filteredTasks} />
	</div>
	<div class="w-full max-w-4xl shrink-0 px-3 lg:px-0">
		<TaskInput bind:inputRef {toggleIsTyping} {addTask} {editTask} {filteredTasks} bind:action />
	</div>
</div>
