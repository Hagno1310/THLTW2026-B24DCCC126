import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Input, Select, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { initTaskTrackingData } from '@/services/TaskTracking/data';
import TaskFormModal from '../components/TaskFormModal';

const statusLabel: Record<TaskTracking.TaskStatus, { text: string; color: string }> = {
	todo: { text: 'To Do', color: 'blue' },
	inProgress: { text: 'In Progress', color: 'orange' },
	done: { text: 'Done', color: 'green' },
};

const priorityColor: Record<string, string> = {
	High: 'red',
	Medium: 'orange',
	Low: 'blue',
};

const TaskList: React.FC = () => {
	const { tasks, loading, loadTasks, createTask, updateTask, deleteTask } = useModel('taskTracking');
	const [modalVisible, setModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<TaskTracking.Task | null>(null);
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		initTaskTrackingData();
		loadTasks();
	}, []);

	const filteredTasks = tasks.filter((t) => {
		if (statusFilter && t.status !== statusFilter) return false;
		if (searchText && !t.title.toLowerCase().includes(searchText.toLowerCase())) return false;
		return true;
	});

	const handleSubmit = (values: Partial<TaskTracking.Task>) => {
		if (editingTask) {
			updateTask(editingTask.id, values);
		} else {
			createTask(values);
		}
		setModalVisible(false);
		setEditingTask(null);
	};

	const columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status: TaskTracking.TaskStatus) => (
				<Tag color={statusLabel[status].color}>{statusLabel[status].text}</Tag>
			),
		},
		{
			title: 'Priority',
			dataIndex: 'priority',
			key: 'priority',
			render: (priority: string) => <Tag color={priorityColor[priority]}>{priority}</Tag>,
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			sorter: (a: TaskTracking.Task, b: TaskTracking.Task) => (a.deadline || '').localeCompare(b.deadline || ''),
		},
		{
			title: 'Tags',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: string[]) => tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: any, record: TaskTracking.Task) => (
				<Space>
					<Button
						size='small'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingTask(record);
							setModalVisible(true);
						}}
					/>
					<Popconfirm title='Delete this task?' onConfirm={() => deleteTask(record.id)}>
						<Button size='small' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Space style={{ marginBottom: 16 }} wrap>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingTask(null);
						setModalVisible(true);
					}}
				>
					Add Task
				</Button>
				<Input.Search
					placeholder='Search by title'
					onSearch={setSearchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 200 }}
					allowClear
				/>
				<Select
					placeholder='Filter by status'
					allowClear
					style={{ width: 150 }}
					onChange={(val) => setStatusFilter(val || '')}
				>
					<Select.Option value='todo'>To Do</Select.Option>
					<Select.Option value='inProgress'>In Progress</Select.Option>
					<Select.Option value='done'>Done</Select.Option>
				</Select>
			</Space>
			<Table columns={columns} dataSource={filteredTasks} rowKey='id' loading={loading} pagination={{ pageSize: 10 }} />
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

export default TaskList;
