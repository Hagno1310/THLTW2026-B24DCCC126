import { useState } from 'react';
import { Button, Card, InputNumber, Popconfirm, Progress, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const statusColor: Record<FitnessHealth.GoalStatus, string> = {
	'In Progress': 'processing',
	Achieved: 'success',
	Cancelled: 'default',
};
const typeColor: Record<FitnessHealth.GoalType, string> = {
	'Weight Loss': 'red',
	'Muscle Gain': 'volcano',
	Endurance: 'blue',
	Flexibility: 'purple',
	General: 'cyan',
};

interface Props {
	goal: FitnessHealth.Goal;
	onUpdateCurrent: (id: string, current: number) => void;
	onDelete: (id: string) => void;
}

const GoalCard: React.FC<Props> = ({ goal, onUpdateCurrent, onDelete }) => {
	const [currentVal, setCurrentVal] = useState<number>(goal.current);
	const pct = goal.target > 0 ? Math.min(Math.round((goal.current / goal.target) * 100), 100) : 0;

	return (
		<Card size='small' className='fh-goal-card'>
			<div className='fh-goal-card__header'>
				<h4>{goal.name}</h4>
				<Popconfirm
					title='Delete this goal?'
					okText='Delete'
					okButtonProps={{ danger: true }}
					onConfirm={() => onDelete(goal.id)}
				>
					<Button size='small' danger type='text' icon={<DeleteOutlined />} />
				</Popconfirm>
			</div>

			<div className='fh-goal-card__tags'>
				<Tag color={typeColor[goal.type]}>{goal.type}</Tag>
				<Tag color={statusColor[goal.status]}>{goal.status}</Tag>
			</div>

			<div className='fh-goal-card__progress'>
				<Progress
					percent={pct}
					size='small'
					status={goal.status === 'Achieved' ? 'success' : goal.status === 'Cancelled' ? 'exception' : 'active'}
					strokeColor={goal.status === 'Achieved' ? '#52c41a' : undefined}
				/>
			</div>

			<div className='fh-goal-card__meta'>
				{goal.current} / {goal.target} {goal.unit} &middot; Deadline: {goal.deadline}
			</div>

			{goal.status === 'In Progress' && (
				<div className='fh-goal-card__update'>
					<InputNumber
						size='small'
						min={0}
						max={goal.target}
						value={currentVal}
						onChange={(v) => setCurrentVal(v ?? 0)}
						style={{ width: 100 }}
					/>
					<Button size='small' type='primary' onClick={() => onUpdateCurrent(goal.id, currentVal)}>
						Update
					</Button>
				</div>
			)}
		</Card>
	);
};

export default GoalCard;
