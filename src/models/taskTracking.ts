import { useState } from 'react';
import { getTasks, saveTasks, genId } from '@/services/TaskTracking/data';

export default () => {
	const [tasks, setTasks] = useState<TaskTracking.Task[]>([]);
	const [loading, setLoading] = useState(false);

	const loadTasks = () => {
		setLoading(true);
		const d = getTasks();
		setTasks(d);
		setLoading(false);
		return d;
	};

	const createTask = (data: Partial<TaskTracking.Task>) => {
		const now = new Date().toISOString();
		const item: TaskTracking.Task = {
			id: genId(),
			title: data.title ?? '',
			description: data.description ?? '',
			status: data.status ?? 'todo',
			priority: data.priority ?? 'Medium',
			tags: data.tags ?? [],
			deadline: data.deadline ?? '',
			createdAt: now,
			updatedAt: now,
		};
		const next = [item, ...getTasks()];
		saveTasks(next);
		setTasks(next);
		return item;
	};

	const updateTask = (id: string, data: Partial<TaskTracking.Task>) => {
		const next = getTasks().map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t));
		saveTasks(next);
		setTasks(next);
	};

	const deleteTask = (id: string) => {
		const next = getTasks().filter((t) => t.id !== id);
		saveTasks(next);
		setTasks(next);
	};

	const moveTask = (id: string, newStatus: TaskTracking.TaskStatus) => {
		const next = getTasks().map((t) =>
			t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t,
		);
		saveTasks(next);
		setTasks(next);
	};

	const reorderTasks = (reordered: TaskTracking.Task[]) => {
		saveTasks(reordered);
		setTasks(reordered);
	};

	return {
		tasks,
		loading,
		loadTasks,
		createTask,
		updateTask,
		deleteTask,
		moveTask,
		reorderTasks,
	};
};
