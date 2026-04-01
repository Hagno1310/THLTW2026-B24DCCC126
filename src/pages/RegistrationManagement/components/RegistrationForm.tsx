import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col, Radio } from 'antd';
import { useModel } from 'umi';

interface RegistrationFormProps {
	onCancel: () => void;
	record?: ClubManagement.Registration;
	onSave: (values: ClubManagement.Registration) => void;
	isView?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onCancel, record, onSave, isView }) => {
	const [form] = Form.useForm();
	const { clubs } = useModel('clubManagement');

	useEffect(() => {
		if (record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
			form.setFieldsValue({ status: 'Pending', gender: 'Male' });
		}
	}, [record]);

	const onFinish = (values: any) => {
		const historyEntry: ClubManagement.HistoryEntry = {
			actor: 'Admin',
			action: record ? 'Updated' : 'Created',
			time: new Date().toISOString(),
		};

		onSave({
			...values,
			id: record?.id || Math.random().toString(36).substr(2, 9),
			history: record ? [...(record.history || []), historyEntry] : [historyEntry],
		});
	};

	return (
		<div style={{ padding: 24 }}>
			<h2>{isView ? 'Chi tiết đơn đăng ký' : record ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}</h2>
			<Form form={form} layout='vertical' onFinish={onFinish} disabled={isView}>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='fullName' label='Họ tên' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='email'
							label='Email'
							rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
						>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='phone' label='SĐT' rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='gender' label='Giới tính'>
							<Radio.Group>
								<Radio value='Male'>Nam</Radio>
								<Radio value='Female'>Nữ</Radio>
								<Radio value='Other'>Khác</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name='address' label='Địa chỉ'>
					<Input.TextArea rows={2} />
				</Form.Item>
				<Form.Item name='clubId' label='Câu lạc bộ' rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}>
					<Select placeholder='Chọn câu lạc bộ'>
						{clubs.map((club) => (
							<Select.Option key={club.id} value={club.id}>
								{club.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name='strengths' label='Sở trường'>
					<Input />
				</Form.Item>
				<Form.Item name='reason' label='Lý do đăng ký'>
					<Input.TextArea rows={3} />
				</Form.Item>
				{record?.status === 'Rejected' && (
					<Form.Item name='notes' label='Lý do từ chối'>
						<Input.TextArea rows={2} disabled />
					</Form.Item>
				)}
				<div style={{ textAlign: 'right', marginTop: 16 }}>
					<Button onClick={onCancel} style={{ marginRight: 8 }}>
						Hủy
					</Button>
					{!isView && (
						<Button type='primary' htmlType='submit'>
							Lưu
						</Button>
					)}
				</div>
			</Form>
		</div>
	);
};

export default RegistrationForm;
