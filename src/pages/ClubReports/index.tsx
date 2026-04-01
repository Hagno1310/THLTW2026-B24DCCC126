import React from 'react';
import { useModel } from 'umi';
import { Row, Col, Card, Statistic } from 'antd';
import ColumnChart from '@/components/Chart/ColumnChart';
import {
	FileTextOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	HomeOutlined,
} from '@ant-design/icons';

const ClubReportsPage: React.FC = () => {
	const { clubs, registrations } = useModel('clubManagement');

	const stats = {
		totalClubs: clubs.length,
		pending: registrations.filter((r) => r.status === 'Pending').length,
		approved: registrations.filter((r) => r.status === 'Approved').length,
		rejected: registrations.filter((r) => r.status === 'Rejected').length,
	};

	// Data for Chart
	const xAxis = clubs.map((c) => c.name);
	const pendingData = clubs.map(
		(club) => registrations.filter((r) => r.clubId === club.id && r.status === 'Pending').length,
	);
	const approvedData = clubs.map(
		(club) => registrations.filter((r) => r.clubId === club.id && r.status === 'Approved').length,
	);
	const rejectedData = clubs.map(
		(club) => registrations.filter((r) => r.clubId === club.id && r.status === 'Rejected').length,
	);

	const yAxis = [pendingData, approvedData, rejectedData];
	const yLabel = ['Pending', 'Approved', 'Rejected'];
	const colors = ['#faad14', '#52c41a', '#f5222d'];

	return (
		<div style={{ padding: 24 }}>
			<h2>Báo cáo và thống kê</h2>
			<Row gutter={[16, 16]}>
				<Col span={6}>
					<Card>
						<Statistic
							title='Số câu lạc bộ'
							value={stats.totalClubs}
							prefix={<HomeOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đơn Pending'
							value={stats.pending}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đơn Approved'
							value={stats.approved}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đơn Rejected'
							value={stats.rejected}
							prefix={<CloseCircleOutlined />}
							valueStyle={{ color: '#f5222d' }}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Số đơn đăng ký theo từng CLB' style={{ marginTop: 24 }}>
				<ColumnChart
					xAxis={xAxis}
					yAxis={yAxis}
					yLabel={yLabel}
					colors={colors}
					title='Thống kê trạng thái đăng ký'
					height={400}
					formatY={(val) => Math.round(val).toString()}
				/>
			</Card>
		</div>
	);
};

export default ClubReportsPage;
