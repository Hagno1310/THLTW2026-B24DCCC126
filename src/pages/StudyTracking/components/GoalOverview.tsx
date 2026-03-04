import React, { useState } from 'react';
import { Card, Progress, Row, Col, List, Button, Modal, Form, Select, InputNumber, Typography, message } from 'antd';
import { TrophyOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

interface Props {
	subjects: any[];
	logs: any[];
	goals: any[];
	setGoals: (goals: any[]) => void;
}

const GoalOverview: React.FC<Props> = ({ subjects, logs, goals, setGoals }) => {
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	const currentMonth = moment().format('YYYY-MM');

	const getProgress = (subjectId: string) => {
		const totalDuration = logs
			.filter((l) => l.subjectId === subjectId && moment(l.dateTime).format('YYYY-MM') === currentMonth)
			.reduce((acc, curr) => acc + curr.duration, 0);

		const goal = goals.find((g) => g.subjectId === subjectId);
		if (!goal) return { actual: totalDuration, target: 0, percent: 0 };

		const percent = Math.min(Math.round((totalDuration / goal.targetDuration) * 100), 100);
		return { actual: totalDuration, target: goal.targetDuration, percent };
	};

	const totalActual = logs
		.filter((l) => moment(l.dateTime).format('YYYY-MM') === currentMonth)
		.reduce((acc, curr) => acc + curr.duration, 0);

	const totalTarget = goals.reduce((acc, curr) => acc + curr.targetDuration, 0);
	const totalPercent = totalTarget > 0 ? Math.min(Math.round((totalActual / totalTarget) * 100), 100) : 0;

	const handleUpdateGoal = () => {
		form.validateFields().then((values) => {
			const existing = goals.find((g) => g.subjectId === values.subjectId);
			let newGoals;
			if (existing) {
				newGoals = goals.map((g) =>
					g.subjectId === values.subjectId ? { ...g, targetDuration: values.targetDuration } : g,
				);
			} else {
				newGoals = [...goals, { subjectId: values.subjectId, targetDuration: values.targetDuration }];
			}
			setGoals(newGoals);
			setVisible(false);
			message.success('Cập nhật mục tiêu thành công');
		});
	};

	return (
		<div className='goal-overview'>
			<Row gutter={16} className='stat-row'>
				<Col xs={24} sm={12}>
					<Card className='stat-card' size='small'>
						<div className='stat-content'>
							<div className='stat-label'>Tổng thời gian học tháng này</div>
							<div className='stat-value'>
								<TrophyOutlined />
								{totalActual} <span className='stat-unit'>phút</span>
							</div>
						</div>
					</Card>
				</Col>
				<Col xs={24} sm={12}>
					<Card className='stat-card' size='small'>
						<div className='stat-content'>
							<div className='stat-label'>Tiến độ mục tiêu tổng quát</div>
							<div className='stat-value'>
								{totalPercent} <span className='stat-unit'>%</span>
							</div>
						</div>
					</Card>
				</Col>
			</Row>

			<div className='progress-section'>
				<div className='progress-header'>
					<Title level={4}>Tiến độ từng môn học</Title>
					<Button icon={<EditOutlined />} onClick={() => setVisible(true)}>
						Thiết lập mục tiêu
					</Button>
				</div>

				<List
					dataSource={subjects}
					renderItem={(subject: any) => {
						const { actual, target, percent } = getProgress(subject.id);
						if (target === 0) return null;
						return (
							<List.Item key={subject.id} className='progress-item'>
								<div className='progress-info'>
									<Text strong>{subject.name}</Text>
									<Text type='secondary'>
										{actual} / {target} phút
									</Text>
								</div>
								<Progress percent={percent} strokeColor={percent >= 100 ? '#52c41a' : '#1890ff'} />
							</List.Item>
						);
					}}
				/>

				{goals.length === 0 && <Text type='secondary'>Chưa có mục tiêu nào được thiết lập.</Text>}
			</div>

			<Modal
				title='Thiết lập mục tiêu học tập'
				visible={visible}
				onOk={handleUpdateGoal}
				onCancel={() => setVisible(false)}
				destroyOnClose
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='subjectId' label='Môn học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
						<Select placeholder='Chọn môn học'>
							{subjects.map((s: any) => (
								<Select.Option key={s.id} value={s.id}>
									{s.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='targetDuration'
						label='Mục tiêu thời lượng (phút/tháng)'
						rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default GoalOverview;
