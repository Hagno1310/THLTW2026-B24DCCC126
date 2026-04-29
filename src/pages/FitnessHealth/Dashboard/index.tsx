import { useEffect, useMemo } from 'react';
import { Card, Col, Row, Statistic, Timeline, Typography } from 'antd';
import { CalendarOutlined, FireOutlined, TrophyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';
import './style.less';

const Dashboard: React.FC = () => {
	const { workouts, healthLogs, goals, loadWorkouts, loadHealthLogs, loadGoals } = useModel('fitnessHealth');

	useEffect(() => {
		loadWorkouts();
		loadHealthLogs();
		loadGoals();
	}, []);

	const stats = useMemo(() => {
		const now = moment();
		const monthStart = now.clone().startOf('month');
		const monthWorkouts = workouts.filter(
			(w) => moment(w.date).isSameOrAfter(monthStart, 'day') && w.status === 'Completed',
		);
		const totalWorkouts = monthWorkouts.length;
		const totalCalories = monthWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

		let streak = 0;
		const day = now.clone();
		const workoutDates = new Set(workouts.filter((w) => w.status === 'Completed').map((w) => w.date));
		while (workoutDates.has(day.format('YYYY-MM-DD'))) {
			streak++;
			day.subtract(1, 'day');
		}

		const inProgress = goals.filter((g) => g.status === 'In Progress');
		const goalPct =
			inProgress.length > 0
				? Math.round(
						(inProgress.reduce((sum, g) => sum + Math.min(g.current / g.target, 1), 0) / inProgress.length) * 100,
				  )
				: 0;

		return { totalWorkouts, totalCalories, streak, goalPct };
	}, [workouts, goals]);

	const columnData = useMemo(() => {
		const now = moment();
		const weeks: string[] = [];
		const counts: number[] = [];
		for (let w = 1; w <= 5; w++) {
			const weekStart = now
				.clone()
				.startOf('month')
				.add((w - 1) * 7, 'days');
			const weekEnd = w < 5 ? weekStart.clone().add(6, 'days') : now.clone().endOf('month');
			if (weekStart.isAfter(now.clone().endOf('month'))) break;
			weeks.push(`Week ${w}`);
			const count = workouts.filter((wo) => {
				const d = moment(wo.date);
				return d.isSameOrAfter(weekStart, 'day') && d.isSameOrBefore(weekEnd, 'day') && wo.status === 'Completed';
			}).length;
			counts.push(count);
		}
		return { xAxis: weeks, yAxis: [counts], yLabel: ['Workouts'] };
	}, [workouts]);

	const lineData = useMemo(() => {
		const sorted = [...healthLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
		return {
			xAxis: sorted.map((h) => moment(h.date).format('DD/MM')),
			yAxis: [sorted.map((h) => h.weight)],
			yLabel: ['Weight (kg)'],
		};
	}, [healthLogs]);

	const recentWorkouts = useMemo(() => {
		return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
	}, [workouts]);

	return (
		<div className='fh-dashboard'>
			<div className='fh-dashboard__header'>
				<h2>Fitness & Health Dashboard</h2>
				<p>Track your progress, stay motivated, and crush your goals.</p>
			</div>

			<Row gutter={[16, 16]} className='fh-dashboard__stat-row'>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title='Workouts This Month'
							value={stats.totalWorkouts}
							prefix={<CalendarOutlined className='fh-dashboard__icon-workouts' />}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title='Calories Burned'
							value={stats.totalCalories}
							prefix={<FireOutlined className='fh-dashboard__icon-calories' />}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title='Current Streak'
							value={stats.streak}
							suffix='days'
							prefix={<ThunderboltOutlined className='fh-dashboard__icon-streak' />}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title='Goal Progress'
							value={stats.goalPct}
							suffix='%'
							prefix={<TrophyOutlined className='fh-dashboard__icon-goals' />}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className='fh-dashboard__chart-row'>
				<Col xs={24} lg={12}>
					<Card title='Workouts Per Week (This Month)'>
						<ColumnChart
							xAxis={columnData.xAxis}
							yAxis={columnData.yAxis}
							yLabel={columnData.yLabel}
							formatY={(v) => String(Math.round(v))}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Weight Over Time'>
						<LineChart
							xAxis={lineData.xAxis}
							yAxis={lineData.yAxis}
							yLabel={lineData.yLabel}
							formatY={(v) => `${v} kg`}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Recent Workouts' className='fh-dashboard__timeline-card'>
				<Timeline>
					{recentWorkouts.map((w) => (
						<Timeline.Item key={w.id} color={w.status === 'Completed' ? 'green' : 'red'}>
							<Typography.Text strong>{w.exerciseName}</Typography.Text> &mdash; {w.exerciseType}, {w.duration} min,{' '}
							{w.caloriesBurned} cal
							<br />
							<Typography.Text type='secondary'>{moment(w.date).format('DD/MM/YYYY')}</Typography.Text>
						</Timeline.Item>
					))}
				</Timeline>
			</Card>
		</div>
	);
};

export default Dashboard;
