import React, { useEffect, useState } from 'react';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { useModel } from 'umi';
import { initTaskTrackingData } from '@/services/TaskTracking/data';
import TaskFormModal from '../components/TaskFormModal';
import './style.less';

const columns: { key: TaskTracking.TaskStatus; title: string }[] = [
	{ key: 'todo', title: 'To Do' },
	{ key: 'inProgress', title: 'In Progress' },
	{ key: 'done', title: 'Completed' },
];

const priorityColor: Record<string, string> = {
	High: 'red',
	Medium: 'orange',
	Low: 'blue',
};

const Board: React.FC = () => {
	const { tasks, loadTasks, createTask, updateTask, moveTask, reorderTasks } = useModel('taskTracking');
	const [modalVisible, setModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<TaskTracking.Task | null>(null);

	useEffect(() => {
		initTaskTrackingData();
		loadTasks();
	}, []);

	const onDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;
		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		const newStatus = destination.droppableId as TaskTracking.TaskStatus;

		if (destination.droppableId !== source.droppableId) {
			moveTask(draggableId, newStatus);
		} else {
			// Reorder within same column
			const columnTasks = tasks.filter((t) => t.status === newStatus);
			const [moved] = columnTasks.splice(source.index, 1);
			columnTasks.splice(destination.index, 0, moved);

			const otherTasks = tasks.filter((t) => t.status !== newStatus);
			reorderTasks([...otherTasks, ...columnTasks]);
		}
	};

	const handleSubmit = (values: Partial<TaskTracking.Task>) => {
		if (editingTask) {
			updateTask(editingTask.id, values);
		} else {
			createTask(values);
		}
		setModalVisible(false);
		setEditingTask(null);
	};

	const openAdd = () => {
		setEditingTask(null);
		setModalVisible(true);
	};

	const openEdit = (task: TaskTracking.Task) => {
		setEditingTask(task);
		setModalVisible(true);
	};

	return (
		<div>
			<div style={{ padding: '16px 24px' }}>
				<Button type='primary' icon={<PlusOutlined />} onClick={openAdd}>
					Add Task
				</Button>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className='board'>
					{columns.map((col) => {
						const columnTasks = tasks.filter((t) => t.status === col.key);
						return (
							<div key={col.key} className={`board__column board__column--${col.key}`}>
								<div className='board__column-header'>
									{col.title} ({columnTasks.length})
								</div>
								<Droppable droppableId={col.key}>
									{(droppableProvided) => (
										<div
											ref={droppableProvided.innerRef}
											{...droppableProvided.droppableProps}
											style={{ minHeight: 100 }}
										>
											{columnTasks.map((task, index) => (
												<Draggable key={task.id} draggableId={task.id} index={index}>
													{(draggableProvided) => (
														<div
															ref={draggableProvided.innerRef}
															{...draggableProvided.draggableProps}
															{...draggableProvided.dragHandleProps}
															className='board__card'
															onClick={() => openEdit(task)}
														>
															<div className='board__card-title'>{task.title}</div>
															<div className='board__card-meta'>
																<Tag color={priorityColor[task.priority]}>{task.priority}</Tag>
																<span>{task.deadline || 'No deadline'}</span>
															</div>
															{task.tags.length > 0 && (
																<div style={{ marginTop: 6 }}>
																	{task.tags.map((tag) => (
																		<Tag key={tag} style={{ fontSize: 11 }}>
																			{tag}
																		</Tag>
																	))}
																</div>
															)}
														</div>
													)}
												</Draggable>
											))}
											{droppableProvided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						);
					})}
				</div>
			</DragDropContext>
			<TaskFormModal
				visible={modalVisible}
				task={editingTask}
				onCancel={() => {
					setModalVisible(false);
					setEditingTask(null);
				}}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default Board;
