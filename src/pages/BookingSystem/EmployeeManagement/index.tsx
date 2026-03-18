import React, { useState, useEffect } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Switch,
	TimePicker,
	Row,
	Col,
	Space,
	Card,
	Tag,
	message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { BookingData } from '@/services/BookingSystem/data';
import moment from 'moment';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EmployeeManagement: React.FC = () => {
	const [employees, setEmployees] = useState<BookingSystem.Employee[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingEmployee, setEditingEmployee] = useState<BookingSystem.Employee | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		setEmployees(BookingData.getEmployees());
	}, []);

	const showModal = (employee?: BookingSystem.Employee) => {
		if (employee) {
			setEditingEmployee(employee);
			form.setFieldsValue({
				...employee,
				workingSchedule: employee.workingSchedule,
			});
		} else {
			setEditingEmployee(null);
			form.resetFields();
			// Default schedule
			const defaultSchedule: BookingSystem.WeeklySchedule = {};
			daysOfWeek.forEach((day) => {
				defaultSchedule[day] = { start: '09:00', end: '17:00', enabled: day !== 'Saturday' && day !== 'Sunday' };
			});
			form.setFieldsValue({
				workingSchedule: defaultSchedule,
				maxAppointmentsPerDay: 8,
			});
		}
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		const newEmployees = employees.filter((e) => e.id !== id);
		setEmployees(newEmployees);
		BookingData.saveEmployees(newEmployees);
		message.success('Employee deleted');
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			const newEmployee: BookingSystem.Employee = {
				...values,
				id: editingEmployee ? editingEmployee.id : Date.now().toString(),
			};

			let newEmployees: BookingSystem.Employee[];
			if (editingEmployee) {
				newEmployees = employees.map((e) => (e.id === editingEmployee.id ? newEmployee : e));
			} else {
				newEmployees = [...employees, newEmployee];
			}

			setEmployees(newEmployees);
			BookingData.saveEmployees(newEmployees);
			setIsModalVisible(false);
			message.success(editingEmployee ? 'Employee updated' : 'Employee added');
		});
	};

	const columns = [
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Max Appts/Day', dataIndex: 'maxAppointmentsPerDay', key: 'maxAppointmentsPerDay' },
		{
			title: 'Schedule',
			key: 'schedule',
			render: (record: BookingSystem.Employee) => (
				<Space wrap>
					{daysOfWeek.map((day) => {
						const s = record.workingSchedule[day];
						return s?.enabled ? (
							<Tag color='blue' key={day}>
								{day.substring(0, 3)}: {s.start}-{s.end}
							</Tag>
						) : null;
					})}
				</Space>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (record: BookingSystem.Employee) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => showModal(record)} />
					<Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
				</Space>
			),
		},
	];

	return (
		<Card
			title='Employee Management'
			extra={
				<Button type='primary' icon={<PlusOutlined />} onClick={() => showModal()}>
					Add Employee
				</Button>
			}
		>
			<Table dataSource={employees} columns={columns} rowKey='id' />

			<Modal
				title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={() => setIsModalVisible(false)}
				width={800}
				destroyOnClose
			>
				<Form form={form} layout='vertical'>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='name' label='Employee Name' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='maxAppointmentsPerDay' label='Max Appointments Per Day' rules={[{ required: true }]}>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>

					<h3>Working Schedule</h3>
					{daysOfWeek.map((day) => (
						<Row key={day} gutter={16} align='middle' style={{ marginBottom: 8 }}>
							<Col span={4}>
								<Form.Item name={['workingSchedule', day, 'enabled']} valuePropName='checked' noStyle>
									<Switch checkedChildren={day} unCheckedChildren={day} />
								</Form.Item>
							</Col>
							<Col span={20}>
								<Form.Item
									noStyle
									shouldUpdate={(prevValues, currentValues) =>
										prevValues.workingSchedule?.[day]?.enabled !== currentValues.workingSchedule?.[day]?.enabled
									}
								>
									{({ getFieldValue }) => (
										<Space>
											<Form.Item name={['workingSchedule', day, 'start']} noStyle>
												<Input
													placeholder='09:00'
													disabled={!getFieldValue(['workingSchedule', day, 'enabled'])}
													style={{ width: 100 }}
												/>
											</Form.Item>
											<span>to</span>
											<Form.Item name={['workingSchedule', day, 'end']} noStyle>
												<Input
													placeholder='17:00'
													disabled={!getFieldValue(['workingSchedule', day, 'enabled'])}
													style={{ width: 100 }}
												/>
											</Form.Item>
										</Space>
									)}
								</Form.Item>
							</Col>
						</Row>
					))}
				</Form>
			</Modal>
		</Card>
	);
};

export default EmployeeManagement;
