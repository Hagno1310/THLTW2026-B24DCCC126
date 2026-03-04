import React, { useState, useEffect } from 'react';
import { Tabs, Typography } from 'antd';
import { BookOutlined, HistoryOutlined, LineChartOutlined } from '@ant-design/icons';
import SubjectManager from './components/SubjectManager';
import StudyLogTable from './components/StudyLogTable';
import GoalOverview from './components/GoalOverview';
import './style.less';

const { Title } = Typography;
const { TabPane } = Tabs;

const StudyTracking: React.FC = () => {
	// Persistence Keys
	const STORAGE_KEYS = {
		SUBJECTS: 'STUDY_SUBJECTS',
		LOGS: 'STUDY_LOGS',
		GOALS: 'STUDY_GOALS',
	};

	// State
	const [subjects, setSubjects] = useState<any[]>(() => {
		const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
		return saved
			? JSON.parse(saved)
			: [
					{ id: '1', name: 'Toán' },
					{ id: '2', name: 'Văn' },
					{ id: '3', name: 'Anh' },
			  ];
	});

	const [logs, setLogs] = useState<any[]>(() => {
		const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
		return saved ? JSON.parse(saved) : [];
	});

	const [goals, setGoals] = useState<any[]>(() => {
		const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
		return saved ? JSON.parse(saved) : [];
	});

	// Persist to LocalStorage
	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
	}, [subjects]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
	}, [logs]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
	}, [goals]);

	return (
		<div className='study-tracking-container'>
			<div className='header-section'>
				<Title level={2}>Theo dõi tiến độ học tập</Title>
			</div>

			<Tabs defaultActiveKey='overview' type='card'>
				<TabPane
					tab={
						<span>
							<LineChartOutlined /> Tổng quan & Mục tiêu
						</span>
					}
					key='overview'
				>
					<GoalOverview subjects={subjects} logs={logs} goals={goals} setGoals={setGoals} />
				</TabPane>

				<TabPane
					tab={
						<span>
							<HistoryOutlined /> Tiến độ học tập
						</span>
					}
					key='logs'
				>
					<StudyLogTable logs={logs} setLogs={setLogs} subjects={subjects} />
				</TabPane>

				<TabPane
					tab={
						<span>
							<BookOutlined /> Danh mục môn học
						</span>
					}
					key='subjects'
				>
					<SubjectManager subjects={subjects} setSubjects={setSubjects} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default StudyTracking;
