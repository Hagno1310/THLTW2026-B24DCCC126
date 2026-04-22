import { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

interface Props {
	visible: boolean;
	editing: PersonalBlog.Tag | null;
	onCancel: () => void;
	onSubmit: (values: { name: string }) => void;
}

const TagFormModal: React.FC<Props> = ({ visible, editing, onCancel, onSubmit }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			if (editing) form.setFieldsValue({ name: editing.name });
			else form.resetFields();
		}
	}, [visible, editing]);

	return (
		<Modal
			visible={visible}
			title={editing ? 'Edit Tag' : 'New Tag'}
			onCancel={onCancel}
			onOk={() => form.validateFields().then(onSubmit)}
			okText={editing ? 'Save' : 'Create'}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='name' label='Tag Name' rules={[{ required: true, message: 'Name is required' }]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TagFormModal;
