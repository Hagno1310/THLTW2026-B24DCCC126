import React, { useState, useEffect } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	DatePicker,
	Select,
	Space,
	Card,
	Tag,
	message,
	Typography,
	Row,
	Col,
} from 'antd';
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, StarOutlined } from '@ant-design/icons';
import { BookingData } from '@/services/BookingSystem/data';
import moment from 'moment';

const { Text } = Typography;
const { Option } = Select;

const AppointmentBooking: React.FC = () => {
	const [appointments, setAppointments] = useState<BookingSystem.Appointment[]>([]);
	const [employees, setEmployees] = useState<BookingSystem.Employee[]>([]);
	const [services, setServices] = useState<BookingSystem.Service[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [reviewModalVisible, setReviewModalVisible] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<BookingSystem.Appointment | null>(null);
	const [form] = Form.useForm();
	const [reviewForm] = Form.useForm();

	const loadData = () => {
		setAppointments(BookingData.getAppointments());
		setEmployees(BookingData.getEmployees());
		setServices(BookingData.getServices());
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleStatusChange = (id: string, status: BookingSystem.AppointmentStatus) => {
		const newAppointments = appointments.map((a) => (a.id === id ? { ...a, status } : a));
		setAppointments(newAppointments);
		BookingData.saveAppointments(newAppointments);
		message.success(`Status updated to ${status}`);
	};

	const showBookingModal = () => {
		if (employees.length === 0 || services.length === 0) {
			message.warning('Please add employees and services first');
			return;
		}
		setIsModalVisible(true);
	};

	const handleBooking = () => {
		form.validateFields().then((values) => {
			const { employeeId, serviceId, date, startTime } = values;
			const dateStr = date.format('YYYY-MM-DD');
			const service = services.find((s) => s.id === serviceId);
			const endTime = moment(startTime, 'HH:mm').add(service!.duration, 'minutes').format('HH:mm');
			const startTimeStr = startTime.format('HH:mm');

			// 1. Check Working Hours
			if (!BookingData.isWithinWorkingHours(employeeId, dateStr, startTimeStr, endTime)) {
				message.error('Selected time is outside employee working hours');
				return;
			}

			// 2. Check Daily Capacity
			if (!BookingData.checkDailyCapacity(employeeId, dateStr)) {
				message.error('Employee has reached maximum appointments for this day');
				return;
			}

			// 3. Check Conflicts
			if (BookingData.checkScheduleConflict(employeeId, dateStr, startTimeStr, endTime)) {
				message.error('Schedule conflict: Employee is already booked for this time');
				return;
			}

			const newAppointment: BookingSystem.Appointment = {
				id: Date.now().toString(),
				customerName: values.customerName,
				customerPhone: values.customerPhone,
				employeeId,
				serviceId,
				date: dateStr,
				startTime: startTimeStr,
				endTime,
				status: 'Pending',
				createdAt: new Date().toISOString(),
			};

			const newAppointments = [newAppointment, ...appointments];
			setAppointments(newAppointments);
			BookingData.saveAppointments(newAppointments);
			setIsModalVisible(false);
			form.resetFields();
			message.success('Appointment booked successfully');
		});
	};

	const showReviewModal = (appointment: BookingSystem.Appointment) => {
		setSelectedAppointment(appointment);
		setReviewModalVisible(true);
	};

	const handleReviewSubmit = () => {
		reviewForm.validateFields().then((values) => {
			const newReview: BookingSystem.Review = {
				id: Date.now().toString(),
				appointmentId: selectedAppointment!.id,
				employeeId: selectedAppointment!.employeeId,
				rating: values.rating,
				comment: values.comment,
				createdAt: new Date().toISOString(),
			};

			const reviews = BookingData.getReviews();
			BookingData.saveReviews([...reviews, newReview]);
			setReviewModalVisible(false);
			reviewForm.resetFields();
			message.success('Review submitted successfully');
		});
	};

	const columns = [
		{ title: 'Date', dataIndex: 'date', key: 'date' },
		{
			title: 'Time',
			key: 'time',
			render: (record: BookingSystem.Appointment) => `${record.startTime} - ${record.endTime}`,
		},
		{ title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
		{
			title: 'Employee',
			dataIndex: 'employeeId',
			key: 'employeeId',
			render: (id: string) => employees.find((e) => e.id === id)?.name,
		},
		{
			title: 'Service',
			dataIndex: 'serviceId',
			key: 'serviceId',
			render: (id: string) => services.find((s) => s.id === id)?.name,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				let color = 'blue';
				if (status === 'Confirmed') color = 'green';
				if (status === 'Completed') color = 'gold';
				if (status === 'Cancelled') color = 'red';
				return <Tag color={color}>{status}</Tag>;
			},
		},
		{
			title: 'Action',
			key: 'action',
			render: (record: BookingSystem.Appointment) => (
				<Space>
					{record.status === 'Pending' && (
						<Button size='small' type='primary' onClick={() => handleStatusChange(record.id, 'Confirmed')}>
							Confirm
						</Button>
					)}
					{record.status === 'Confirmed' && (
						<Button size='small' type='primary' onClick={() => handleStatusChange(record.id, 'Completed')}>
							Complete
						</Button>
					)}
					{record.status !== 'Completed' && record.status !== 'Cancelled' && (
						<Button size='small' danger onClick={() => handleStatusChange(record.id, 'Cancelled')}>
							Cancel
						</Button>
					)}
					{record.status === 'Completed' && (
						<Button size='small' icon={<StarOutlined />} onClick={() => showReviewModal(record)}>
							Review
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<Card
			title='Appointment Management'
			extra={
				<Button type='primary' icon={<PlusOutlined />} onClick={showBookingModal}>
					Book Appointment
				</Button>
			}
		>
			<Table dataSource={appointments} columns={columns} rowKey='id' />

			<Modal
				title='Book Appointment'
				visible={isModalVisible}
				onOk={handleBooking}
				onCancel={() => setIsModalVisible(false)}
				destroyOnClose
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='customerName' label='Customer Name' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='customerPhone' label='Phone Number' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='employeeId' label='Employee' rules={[{ required: true }]}>
						<Select placeholder='Select Employee'>
							{employees.map((e) => (
								<Option key={e.id} value={e.id}>
									{e.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='serviceId' label='Service' rules={[{ required: true }]}>
						<Select placeholder='Select Service'>
							{services.map((s) => (
								<Option key={s.id} value={s.id}>
									{s.name} ({s.duration} min)
								</Option>
							))}
						</Select>
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='date' label='Date' rules={[{ required: true }]}>
								<DatePicker style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='startTime' label='Start Time' rules={[{ required: true }]}>
								<DatePicker picker='time' format='HH:mm' style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>

			<Modal
				title='Leave a Review'
				visible={reviewModalVisible}
				onOk={handleReviewSubmit}
				onCancel={() => setReviewModalVisible(false)}
			>
				<Form form={reviewForm} layout='vertical'>
					<Form.Item name='rating' label='Rating' rules={[{ required: true }]}>
						<Select placeholder='Select rating'>
							{[1, 2, 3, 4, 5].map((r) => (
								<Option key={r} value={r}>
									{r} Stars
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='comment' label='Comment' rules={[{ required: true }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default AppointmentBooking;
