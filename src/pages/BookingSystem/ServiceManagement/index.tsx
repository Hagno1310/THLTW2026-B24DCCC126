import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Card, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { BookingData } from '@/services/BookingSystem/data';

const ServiceManagement: React.FC = () => {
	const [services, setServices] = useState<BookingSystem.Service[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingService, setEditingService] = useState<BookingSystem.Service | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		setServices(BookingData.getServices());
	}, []);

	const showModal = (service?: BookingSystem.Service) => {
		if (service) {
			setEditingService(service);
			form.setFieldsValue(service);
		} else {
			setEditingService(null);
			form.resetFields();
		}
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		const newServices = services.filter((s) => s.id !== id);
		setServices(newServices);
		BookingData.saveServices(newServices);
		message.success('Service deleted');
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			const newService: BookingSystem.Service = {
				...values,
				id: editingService ? editingService.id : Date.now().toString(),
			};

			let newServices: BookingSystem.Service[];
			if (editingService) {
				newServices = services.map((s) => (s.id === editingService.id ? newService : s));
			} else {
				newServices = [...services, newService];
			}

			setServices(newServices);
			BookingData.saveServices(newServices);
			setIsModalVisible(false);
			message.success(editingService ? 'Service updated' : 'Service added');
		});
	};

	const columns = [
		{ title: 'Service Name', dataIndex: 'name', key: 'name' },
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
		},
		{
			title: 'Duration (min)',
			dataIndex: 'duration',
			key: 'duration',
			render: (duration: number) => `${duration} mins`,
		},
		{
			title: 'Action',
			key: 'action',
			render: (record: BookingSystem.Service) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => showModal(record)} />
					<Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
				</Space>
			),
		},
	];

	return (
		<Card
			title='Service Management'
			extra={
				<Button type='primary' icon={<PlusOutlined />} onClick={() => showModal()}>
					Add Service
				</Button>
			}
		>
			<Table dataSource={services} columns={columns} rowKey='id' />

			<Modal
				title={editingService ? 'Edit Service' : 'Add Service'}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Service Name' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='price' label='Price (VND)' rules={[{ required: true }]}>
						<InputNumber min={0} step={1000} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='duration' label='Duration (minutes)' rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default ServiceManagement;
