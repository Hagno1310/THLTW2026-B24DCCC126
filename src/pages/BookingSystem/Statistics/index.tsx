import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Typography } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import { BookingData } from '@/services/BookingSystem/data';

const { Title } = Typography;

const BookingStatistics: React.FC = () => {
	const [employees, setEmployees] = useState<BookingSystem.Employee[]>([]);
	const [services, setServices] = useState<BookingSystem.Service[]>([]);
	const [appointments, setAppointments] = useState<BookingSystem.Appointment[]>([]);

	useEffect(() => {
		setEmployees(BookingData.getEmployees());
		setServices(BookingData.getServices());
		setAppointments(BookingData.getAppointments());
	}, []);

	const completedAppointments = appointments.filter((a) => a.status === 'Completed');

	const totalRevenue = completedAppointments.reduce((sum, app) => {
		const service = services.find((s) => s.id === app.serviceId);
		return sum + (service?.price || 0);
	}, 0);

	const employeeStats = employees.map((emp) => {
		const stats = BookingData.getEmployeeStats(emp.id);
		return {
			...emp,
			...stats,
		};
	});

	const serviceStats = services.map((srv) => {
		const count = completedAppointments.filter((a) => a.serviceId === srv.id).length;
		const revenue = count * srv.price;
		return {
			...srv,
			count,
			revenue,
		};
	});

	return (
		<div>
			<Row gutter={16}>
				<Col span={6}>
					<Card>
						<Statistic title='Total Appointments' value={appointments.length} prefix={<CalendarOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Completed'
							value={completedAppointments.length}
							prefix={<ShoppingCartOutlined />}
							valueStyle={{ color: '#3f8600' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Revenue' value={totalRevenue} prefix={<DollarOutlined />} suffix='VND' />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Employees' value={employees.length} prefix={<UserOutlined />} />
					</Card>
				</Col>
			</Row>

			<Row gutter={16} style={{ marginTop: 24 }}>
				<Col span={12}>
					<Card title='Revenue by Employee'>
						<Table
							dataSource={employeeStats}
							pagination={false}
							rowKey='id'
							columns={[
								{ title: 'Employee', dataIndex: 'name', key: 'name' },
								{ title: 'Appts', dataIndex: 'completedCount', key: 'completedCount' },
								{
									title: 'Revenue',
									dataIndex: 'revenue',
									key: 'revenue',
									render: (val: number) => new Intl.NumberFormat('vi-VN').format(val),
								},
								{
									title: 'Rating',
									dataIndex: 'averageRating',
									key: 'averageRating',
									render: (val: number) => val.toFixed(1),
								},
							]}
						/>
					</Card>
				</Col>
				<Col span={12}>
					<Card title='Revenue by Service'>
						<Table
							dataSource={serviceStats}
							pagination={false}
							rowKey='id'
							columns={[
								{ title: 'Service', dataIndex: 'name', key: 'name' },
								{ title: 'Usage', dataIndex: 'count', key: 'count' },
								{
									title: 'Revenue',
									dataIndex: 'revenue',
									key: 'revenue',
									render: (val: number) => new Intl.NumberFormat('vi-VN').format(val),
								},
							]}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default BookingStatistics;
