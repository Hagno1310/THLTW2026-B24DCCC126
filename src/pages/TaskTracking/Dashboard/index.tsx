import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { initTaskTrackingData } from '@/services/TaskTracking/data';

const Dashboard: React.FC = () => {
	const { tasks, loadTasks } = useModel('taskTracking');

	useEffect(() => {
		initTaskTrackingData();
		loadTasks();
	}, []);

	const total = tasks.length;
	const completed = tasks.filter((t) => t.status === 'done').length;
	const overdue = tasks.filter(
		(t) => t.status !== 'done' && t.deadline && t.deadline < new Date().toISOString().slice(0, 10),
	).length;

	return (
		<div style={{ padding: 24 }}>
			<Row gutter={16}>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title='Total Tasks'
							value={total}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title='Completed'
							value={completed}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic title='Overdue' value={overdue} prefix={<WarningOutlined />} valueStyle={{ color: '#ff4d4f' }} />
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
