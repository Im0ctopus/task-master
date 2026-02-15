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
	import TaskInput, { type InputActions } from '$lib/components/taskInput.svelte';
	import type { Status } from '$lib/types/status';
	import { bindManager, type BindActions } from '$lib/utils/bindManager';
	import { getObjFromLocalStorage, saveObjOnLocalStorage } from '$lib/utils/localStorageHelper';
	import { type Action } from '$lib/utils/actionsHelper';
	import TabSelector from '$lib/components/tabSelector/tabSelector.svelte';
	import TaskList from '$lib/components/tasks/taskList.svelte';
	import { onMount, setContext } from 'svelte';
	import { defaultSelectedTask, type SelectedTask, type TaskContext } from '$lib/types/taskContext';
	import { filterTasks, verifyNewSelection } from '$lib/utils/tasksHelper';
	import Search from '$lib/components/search.svelte';

	let tasks: Task[] = $state([]);
	let isTyping = $state(false);
	let isSearching = $state(false);
	let searchValue = $state('');
	let selectedTask: SelectedTask = $state(defaultSelectedTask);
	let openedTasks: number[] = $state([]);
	let action: null | Action = $state(null);
	let selectedTab: Status = $state('none');

	let currentId: number = 0;

	let filteredTasks: Task[] = $derived(filterTasks(tasks, selectedTab, searchValue.trim()));

	// svelte-ignore non_reactive_update
	let inputRef: HTMLTextAreaElement;
	// svelte-ignore non_reactive_update
	let searchInputRef: HTMLInputElement;

	setContext('getSelectedTab', () => selectedTab);

	const setSelectedTask = (task: SelectedTask) => (selectedTask = task);
	let taskContext: TaskContext = {
		getSelectedTask: () => selectedTask,
		setSelectedTask
	};
	setContext('taskContext', taskContext);

	onMount(() => {
		const storedTasks = getObjFromLocalStorage('tasks');
		if (!storedTasks) return;
		tasks = storedTasks;
		if (storedTasks && storedTasks.length) currentId = Math.max(...tasks.map((t) => t.id));
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
			onTabChange,
			onStatusChange,
			onTaskChange,
			toggleTaskOpen: (index: number) => {
				const task = filteredTasks[index];
				if (!task) return;

				toggleTaskOpen(task.id);
			},
			toggleSearch
		};

		bindManager(e, selectedTask, actions);
	};

	let toggleIsTyping = (val: boolean) => {
		if (!val) setTimeout(() => (isTyping = false), 10);
		else isTyping = val;
		val ? inputRef.focus() : inputRef.blur();
	};

	let onTabChange = (tab: Status) => (selectedTab = tab);

	const addTask = (task: Pick<Task, 'name' | 'urgency'>) => {
		const id = ++currentId;
		const newTasks: Task[] = [...tasks, { ...task, id, status: 'none', subTasks: [] }];
		tasks = newTasks;
		saveObjOnLocalStorage('tasks', newTasks);
	};

	const editTask = (id: number, newTask: Pick<Task, 'name' | 'urgency'>) => {
		const taskIndex = tasks.findIndex((t) => t.id === id);
		if (taskIndex === -1) {
			console.error(`Task with id ${id} not found`);
			return;
		}

		tasks[taskIndex] = { ...tasks[taskIndex], ...newTask };
		saveObjOnLocalStorage('tasks', tasks);

		action = null;
	};

	const addSubTask = (taskId: number, subTask: Pick<Task, 'name' | 'urgency'>) => {
		const index = tasks.findIndex((t) => t.id === taskId);
		if (index === -1) return;

		const id = tasks[index].subTasks.length
			? Math.max(...tasks[index].subTasks.map((t) => t.id)) + 1
			: 1;
		tasks[index].subTasks.push({
			...subTask,
			id,
			status: 'none'
		});

		saveObjOnLocalStorage('tasks', tasks);
		!openedTasks.includes(taskId) && openedTasks.push(taskId);
	};

	const editSubTask = (
		taskId: number,
		subTaskId: number,
		subTask: Pick<Task, 'name' | 'urgency'>
	) => {
		const taskIndex = tasks.findIndex((t) => t.id === taskId);
		if (taskIndex === -1) {
			console.error(`Task with id ${taskId} not found`);
			return;
		}

		const subTaskIndex = tasks[taskIndex].subTasks.findIndex((t) => t.id === subTaskId);
		if (subTaskIndex === -1) {
			console.error(`Subtask with id ${subTaskId} not found in task ${taskId}`);
			return;
		}

		const oldSubTask = tasks[taskIndex].subTasks[subTaskIndex];
		tasks[taskIndex].subTasks[subTaskIndex] = { ...oldSubTask, ...subTask };

		saveObjOnLocalStorage('tasks', tasks);
		action = null;
		!openedTasks.includes(taskId) && openedTasks.push(taskId);
	};

	const onStatusChange = (status: Status, taskIndex: number, subTaskIndex?: number) => {
		const task = filteredTasks[taskIndex];
		if (!task) {
			console.error(`Task with index ${taskIndex} not found`);
			return;
		}
		const taskInd = tasks.findIndex((t) => t.id === task.id);

		if (subTaskIndex === undefined) {
			tasks[taskInd] = {
				...tasks[taskInd],
				status: tasks[taskInd].status === status ? 'none' : status
			};
		} else {
			const subTask = task.subTasks[subTaskIndex];
			if (!subTask) {
				console.error(`Subtask with index ${subTaskIndex} not found in task ${task.id}`);
				return;
			}

			const subTaskInd = tasks[taskInd].subTasks.findIndex((t) => t.id === subTask.id);
			tasks[taskInd].subTasks[subTaskInd] = {
				...tasks[taskInd].subTasks[subTaskInd],
				status: tasks[taskInd].subTasks[subTaskInd].status === status ? 'none' : status
			};
		}

		saveObjOnLocalStorage('tasks', tasks);
		selectedTask = verifyNewSelection(filteredTasks, selectedTask);
	};

	const onTaskChange = (goto: -1 | 1, skip?: boolean) => {
		const { taskIndex, subTaskIndex } = selectedTask;
		const currentTask = filteredTasks[taskIndex];
		if (!currentTask) return;

		if (
			skip ||
			!openedTasks.includes(currentTask.id) ||
			(goto === -1 && subTaskIndex === undefined)
		) {
			const newIndex = taskIndex + goto;
			const newTask = filteredTasks[newIndex];
			if (!newTask) return;

			if (skip || goto === 1 || !openedTasks.includes(newTask.id)) {
				selectedTask = { taskIndex: newIndex };
			} else {
				selectedTask = { taskIndex: newIndex, subTaskIndex: newTask.subTasks.length - 1 };
			}
		} else {
			const newSubTaskIndex = subTaskIndex !== undefined ? subTaskIndex + goto : 0;
			const task = filteredTasks[taskIndex];
			if (!task) return;

			const newSubTask = task.subTasks[newSubTaskIndex];

			if (newSubTaskIndex < 0) selectedTask = { taskIndex };
			else if (!newSubTask) {
				const newTask = filteredTasks[taskIndex + 1];
				if (newTask) selectedTask = { taskIndex: taskIndex + 1 };
			} else
				selectedTask = {
					taskIndex,
					subTaskIndex: newSubTaskIndex
				};
		}
	};

	const toggleTaskOpen = (id: number) => {
		const task = tasks.find((t) => t.id === id);
		const filteredTask = filteredTasks.find((t) => t.id === id);
		if (!task || !filteredTask?.subTasks.length) return;

		if (!openedTasks.includes(id)) openedTasks.push(id);
		else {
			const index = openedTasks.findIndex((t) => t === id);
			if (index === -1) return;

			openedTasks.splice(index, 1);
		}
	};

	const toggleSearch = (value: boolean) => {
		if (value && searchInputRef) searchInputRef.focus();

		if (!value) searchValue = '';

		isSearching = value;
		isTyping = value;
	};

	$effect(() => {
		searchValue;
		selectedTab;

		selectedTask = defaultSelectedTask;
	});

	let inputActions: InputActions = $derived({
		addSubTask,
		addTask,
		editTask,
		toggleIsTyping,
		editSubTask
	});
</script>

<div class="flex h-screen w-full flex-col items-center justify-start overflow-clip font-main">
	<TabSelector bind:selectedTab />
	<div class="relative min-h-0 w-full grow">
		<TaskList {filteredTasks} {openedTasks} {toggleTaskOpen} />
	</div>
	<div class="w-full max-w-4xl shrink-0 px-3 lg:px-0">
		<TaskInput bind:inputRef {filteredTasks} bind:action actions={inputActions} {toggleSearch} />
	</div>
</div>

<Search
	bind:searchInputRef
	{isSearching}
	bind:searchValue
	onBlur={() => setTimeout(() => (isTyping = false), 10)}
	onClose={() => toggleSearch(false)}
	taskAmount={filteredTasks.length}
	{toggleIsTyping}
/>
