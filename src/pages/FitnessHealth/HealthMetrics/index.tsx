import { useEffect, useState } from 'react';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import HealthForm from './HealthForm';
import './style.less';

const getBmiTag = (bmi: number) => {
	if (bmi < 18.5) return <Tag color='blue'>Underweight</Tag>;
	if (bmi < 25) return <Tag color='green'>Normal</Tag>;
	if (bmi < 30) return <Tag color='gold'>Overweight</Tag>;
	return <Tag color='red'>Obese</Tag>;
};

const HealthMetrics: React.FC = () => {
	const { healthLogs, loadHealthLogs, createHealthLog, updateHealthLog, deleteHealthLog } = useModel('fitnessHealth');
	const [formVisible, setFormVisible] = useState(false);
	const [editing, setEditing] = useState<FitnessHealth.HealthLog | null>(null);

	useEffect(() => {
		loadHealthLogs();
	}, []);

	const handleSubmit = (values: any) => {
		if (editing) updateHealthLog(editing.id, values);
		else createHealthLog(values);
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
			sorter: (a: FitnessHealth.HealthLog, b: FitnessHealth.HealthLog) =>
				new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{
			title: 'Weight (kg)',
			dataIndex: 'weight',
			key: 'weight',
			width: 120,
			sorter: (a: FitnessHealth.HealthLog, b: FitnessHealth.HealthLog) => a.weight - b.weight,
		},
		{ title: 'Height (cm)', dataIndex: 'height', key: 'height', width: 120 },
		{
			title: 'BMI',
			dataIndex: 'bmi',
			key: 'bmi',
			width: 170,
			render: (bmi: number) => (
				<div className='fh-health__bmi-cell'>
					<span>{bmi}</span>
					{getBmiTag(bmi)}
				</div>
			),
			sorter: (a: FitnessHealth.HealthLog, b: FitnessHealth.HealthLog) => a.bmi - b.bmi,
		},
		{ title: 'Heart Rate (bpm)', dataIndex: 'heartRate', key: 'heartRate', width: 150 },
		{ title: 'Sleep (hrs)', dataIndex: 'sleepHours', key: 'sleepHours', width: 120 },
		{
			title: 'Actions',
			key: 'actions',
			width: 120,
			render: (_: any, record: FitnessHealth.HealthLog) => (
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
						title='Delete this record?'
						okText='Delete'
						okButtonProps={{ danger: true }}
						onConfirm={() => deleteHealthLog(record.id)}
					>
						<Button size='small' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='fh-health'>
			<div className='fh-health__toolbar'>
				<h2>Health Metrics</h2>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditing(null);
						setFormVisible(true);
					}}
				>
					Add Record
				</Button>
			</div>
			<Table rowKey='id' columns={columns as any} dataSource={healthLogs} pagination={{ pageSize: 10 }} />
			<HealthForm
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

export default HealthMetrics;
