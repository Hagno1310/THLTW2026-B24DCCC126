import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Row, Segmented } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import GoalCard from './GoalCard';
import GoalDrawerForm from './GoalDrawerForm';
import './style.less';

const statusOptions = ['All', 'In Progress', 'Achieved', 'Cancelled'];

const GoalManagement: React.FC = () => {
	const { goals, loadGoals, createGoal, updateGoalCurrent, deleteGoal } = useModel('fitnessHealth');
	const [statusFilter, setStatusFilter] = useState<string>('All');
	const [drawerVisible, setDrawerVisible] = useState(false);

	useEffect(() => {
		loadGoals();
	}, []);

	const filtered = useMemo(() => {
		if (statusFilter === 'All') return goals;
		return goals.filter((g) => g.status === statusFilter);
	}, [goals, statusFilter]);

	const handleSubmit = (values: any) => {
		createGoal(values);
	};

	return (
		<div className='fh-goals'>
			<div className='fh-goals__toolbar'>
				<h2>Goal Management</h2>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>
					Add Goal
				</Button>
			</div>

			<div className='fh-goals__filters'>
				<Segmented options={statusOptions} value={statusFilter} onChange={(v) => setStatusFilter(v as string)} />
			</div>

			<Row gutter={[16, 16]} className='fh-goals__grid'>
				{filtered.map((g) => (
					<Col xs={24} sm={12} lg={8} key={g.id}>
						<GoalCard goal={g} onUpdateCurrent={updateGoalCurrent} onDelete={deleteGoal} />
					</Col>
				))}
			</Row>

			<GoalDrawerForm visible={drawerVisible} onClose={() => setDrawerVisible(false)} onSubmit={handleSubmit} />
		</div>
	);
};

export default GoalManagement;
