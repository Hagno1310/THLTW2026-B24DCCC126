import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

export interface Product {
	id: number;
	name: string;
	price: number;
	quantity: number;
}

interface FormModalProps {
	open: boolean;
	onCancel: () => void;
	onSubmit: (values: Omit<Product, 'id'>) => void;
	initialValues?: Product | null;
}

const FormModal: React.FC<FormModalProps> = ({ open, onCancel, onSubmit, initialValues }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (initialValues) {
			form.setFieldsValue(initialValues);
		} else {
			form.resetFields();
		}
	}, [initialValues, form]);

	const handleOk = async () => {
		const values = await form.validateFields();
		onSubmit(values);
	};

	return (
		<Modal
			visible={open}
			title={initialValues ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
			onCancel={onCancel}
			onOk={handleOk}
			okText='Lưu'
			cancelText='Hủy'
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
					<Input />
				</Form.Item>

				<Form.Item label='Giá' name='price' rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
					<InputNumber
						style={{ width: '100%' }}
						min={0}
						formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					/>
				</Form.Item>

				<Form.Item label='Số lượng' name='quantity' rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
					<InputNumber style={{ width: '100%' }} min={0} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormModal;
