import { useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Input, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import WorkoutForm from './WorkoutForm';
import './style.less';

const exerciseTypes: FitnessHealth.ExerciseType[] = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
const typeColors: Record<FitnessHealth.ExerciseType, string> = {
	Cardio: 'blue',
	Strength: 'volcano',
	Yoga: 'purple',
	HIIT: 'magenta',
	Other: 'default',
};

const WorkoutLog: React.FC = () => {
	const { workouts, loading, loadWorkouts, createWorkout, updateWorkout, deleteWorkout } = useModel('fitnessHealth');
	const [search, setSearch] = useState('');
	const [typeFilter, setTypeFilter] = useState<string>('all');
	const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);
	const [formVisible, setFormVisible] = useState(false);
	const [editing, setEditing] = useState<FitnessHealth.Workout | null>(null);

	useEffect(() => {
		loadWorkouts();
	}, []);

	const filtered = useMemo(() => {
		const term = search.toLowerCase();
		return workouts
			.filter((w) => (term ? w.exerciseName.toLowerCase().includes(term) : true))
			.filter((w) => (typeFilter !== 'all' ? w.exerciseType === typeFilter : true))
			.filter((w) => {
				if (!dateRange || !dateRange[0] || !dateRange[1]) return true;
				const d = moment(w.date);
				return d.isSameOrAfter(dateRange[0], 'day') && d.isSameOrBefore(dateRange[1], 'day');
			});
	}, [workouts, search, typeFilter, dateRange]);

	const handleSubmit = (values: any) => {
		if (editing) updateWorkout(editing.id, values);
		else createWorkout(values);
		setFormVisible(false);
		setEditing(null);
	};

	const columns = [
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			width: 120,
			render: (d: string) => moment(d).format('DD/MM/YYYY'),
			sorter: (a: FitnessHealth.Workout, b: FitnessHealth.Workout) =>
				new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{ title: 'Exercise', dataIndex: 'exerciseName', key: 'exerciseName' },
		{
			title: 'Type',
			dataIndex: 'exerciseType',
			key: 'exerciseType',
			width: 110,
			render: (t: FitnessHealth.ExerciseType) => <Tag color={typeColors[t]}>{t}</Tag>,
		},
		{
			title: 'Duration (min)',
			dataIndex: 'duration',
			key: 'duration',
			width: 130,
			sorter: (a: FitnessHealth.Workout, b: FitnessHealth.Workout) => a.duration - b.duration,
		},
		{
			title: 'Calories',
			dataIndex: 'caloriesBurned',
			key: 'caloriesBurned',
			width: 100,
			sorter: (a: FitnessHealth.Workout, b: FitnessHealth.Workout) => a.caloriesBurned - b.caloriesBurned,
		},
		{ title: 'Notes', dataIndex: 'notes', key: 'notes', ellipsis: true },
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: 110,
			render: (s: FitnessHealth.WorkoutStatus) => <Tag color={s === 'Completed' ? 'green' : 'red'}>{s}</Tag>,
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 120,
			render: (_: any, record: FitnessHealth.Workout) => (
				<Space>
					<Button
						size='small'
						icon={<EditOutlined />}
						onClick={() => {
							setEditing(record);
							setFormVisible(true);
						}}
					/>
					<Popconfirm
						title='Delete this workout?'
						okText='Delete'
						okButtonProps={{ danger: true }}
						onConfirm={() => deleteWorkout(record.id)}
					>
						<Button size='small' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='fh-workouts'>
			<div className='fh-workouts__toolbar'>
				<h2>Workout Log</h2>
				<Input.Search
					placeholder='Search exercise...'
					allowClear
					style={{ width: 220 }}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Select
					value={typeFilter}
					onChange={setTypeFilter}
					style={{ width: 140 }}
					options={[{ value: 'all', label: 'All Types' }, ...exerciseTypes.map((t) => ({ value: t, label: t }))]}
				/>
				<DatePicker.RangePicker onChange={(dates) => setDateRange(dates as any)} />
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditing(null);
						setFormVisible(true);
					}}
				>
					Add Workout
				</Button>
			</div>
			<Table
				rowKey='id'
				columns={columns as any}
				dataSource={filtered}
				loading={loading}
				pagination={{ pageSize: 10 }}
			/>
			<WorkoutForm
				visible={formVisible}
				editing={editing}
				onCancel={() => {
					setFormVisible(false);
					setEditing(null);
				}}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default WorkoutLog;
