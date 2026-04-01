import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Switch, Button, Row, Col } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';

interface ClubFormProps {
	onCancel: () => void;
	record?: ClubManagement.Club;
	onSave: (values: ClubManagement.Club) => void;
}

const ClubForm: React.FC<ClubFormProps> = ({ onCancel, record, onSave }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (record) {
			form.setFieldsValue({
				...record,
				foundedDate: record.foundedDate ? moment(record.foundedDate) : undefined,
			});
		} else {
			form.resetFields();
			form.setFieldsValue({ isActive: true });
		}
	}, [record]);

	const onFinish = (values: any) => {
		onSave({
			...values,
			id: record?.id || Math.random().toString(36).substr(2, 9),
			foundedDate: values.foundedDate?.toISOString(),
		});
	};

	return (
		<div style={{ padding: 24 }}>
			<h2>{record ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}</h2>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='name'
							label='Tên câu lạc bộ'
							rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='chairman'
							label='Chủ nhiệm CLB'
							rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
						>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='foundedDate' label='Ngày thành lập'>
							<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='isActive' label='Hoạt động' valuePropName='checked'>
							<Switch />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name='avatar' label='URL Ảnh đại diện'>
					<Input placeholder='https://example.com/image.png' />
				</Form.Item>
				<Form.Item name='description' label='Mô tả'>
					<Editor
						init={{
							height: 300,
							menubar: false,
							plugins: [
								'advlist autolink lists link image charmap print preview anchor',
								'searchreplace visualblocks code fullscreen',
								'insertdatetime media table paste code help wordcount',
							],
							toolbar:
								'undo redo | formatselect | bold italic backcolor | \
								alignleft aligncenter alignright alignjustify | \
								bulletedlist numberedlist outdent indent | removeformat | help',
						}}
						onEditorChange={(content) => form.setFieldsValue({ description: content })}
						value={form.getFieldValue('description')}
					/>
				</Form.Item>
				<div style={{ textAlign: 'right', marginTop: 16 }}>
					<Button onClick={onCancel} style={{ marginRight: 8 }}>
						Hủy
					</Button>
					<Button type='primary' htmlType='submit'>
						Lưu
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default ClubForm;
