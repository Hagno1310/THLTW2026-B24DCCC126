import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';

interface Props {
	visible: boolean;
	task?: TaskTracking.Task | null;
	onCancel: () => void;
	onSubmit: (values: Partial<TaskTracking.Task>) => void;
}

const TaskFormModal: React.FC<Props> = ({ visible, task, onCancel, onSubmit }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible && task) {
			form.setFieldsValue({
				...task,
				deadline: task.deadline ? moment(task.deadline) : undefined,
			});
		} else if (visible) {
			form.resetFields();
		}
	}, [visible, task]);

	const handleOk = () => {
		form.validateFields().then((values) => {
			onSubmit({
				...values,
				deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : '',
			});
			form.resetFields();
		});
	};

	return (
		<Modal title={task ? 'Edit Task' : 'Add Task'} visible={visible} onOk={handleOk} onCancel={onCancel} destroyOnClose>
			<Form form={form} layout='vertical'>
				<Form.Item name='title' label='Title' rules={[{ required: true, message: 'Please enter a title' }]}>
					<Input />
				</Form.Item>
				<Form.Item name='description' label='Description'>
					<Input.TextArea rows={3} />
				</Form.Item>
				<Form.Item name='deadline' label='Deadline'>
					<DatePicker style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='priority' label='Priority' initialValue='Medium'>
					<Select>
						<Select.Option value='High'>High</Select.Option>
						<Select.Option value='Medium'>Medium</Select.Option>
						<Select.Option value='Low'>Low</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item name='tags' label='Tags'>
					<Select mode='tags' placeholder='Add tags' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaskFormModal;
