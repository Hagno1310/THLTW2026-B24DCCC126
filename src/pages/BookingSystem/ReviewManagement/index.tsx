import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Rate, List, Avatar, message } from 'antd';
import { BookingData } from '@/services/BookingSystem/data';

const ReviewManagement: React.FC = () => {
	const [reviews, setReviews] = useState<BookingSystem.Review[]>([]);
	const [employees, setEmployees] = useState<BookingSystem.Employee[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedReview, setSelectedReview] = useState<BookingSystem.Review | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		setReviews(BookingData.getReviews());
		setEmployees(BookingData.getEmployees());
	}, []);

	const handleReply = (review: BookingSystem.Review) => {
		setSelectedReview(review);
		form.setFieldsValue({ reply: review.employeeReply });
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			const newReviews = reviews.map((r) => (r.id === selectedReview!.id ? { ...r, employeeReply: values.reply } : r));
			setReviews(newReviews);
			BookingData.saveReviews(newReviews);
			setIsModalVisible(false);
			message.success('Reply saved');
		});
	};

	return (
		<Card title='Customer Reviews'>
			<List
				itemLayout='vertical'
				dataSource={reviews}
				renderItem={(item) => {
					const employee = employees.find((e) => e.id === item.employeeId);
					return (
						<List.Item
							key={item.id}
							extra={<Button onClick={() => handleReply(item)}>{item.employeeReply ? 'Edit Reply' : 'Reply'}</Button>}
						>
							<List.Item.Meta
								avatar={<Avatar src={employee?.avatar}>{employee?.name?.charAt(0)}</Avatar>}
								title={
									<Space>
										<span>{employee?.name}</span>
										<Rate disabled defaultValue={item.rating} />
									</Space>
								}
								description={new Date(item.createdAt).toLocaleString()}
							/>
							<div style={{ padding: '0 48px' }}>
								<p>
									<strong>Customer Comment:</strong> {item.comment}
								</p>
								{item.employeeReply && (
									<Card style={{ backgroundColor: '#f5f5f5', marginTop: 12 }}>
										<p>
											<strong>Employee Reply:</strong> {item.employeeReply}
										</p>
									</Card>
								)}
							</div>
						</List.Item>
					);
				}}
			/>

			<Modal title='Reply to Review' visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
				<Form form={form} layout='vertical'>
					<Form.Item name='reply' label='Your Reply' rules={[{ required: true }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default ReviewManagement;
