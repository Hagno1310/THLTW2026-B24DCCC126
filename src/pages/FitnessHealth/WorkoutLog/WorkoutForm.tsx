import { useEffect } from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import moment from 'moment';

const exerciseTypes: FitnessHealth.ExerciseType[] = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
const statuses: FitnessHealth.WorkoutStatus[] = ['Completed', 'Missed'];

interface Props {
	visible: boolean;
	editing: FitnessHealth.Workout | null;
	onCancel: () => void;
	onSubmit: (values: any) => void;
}

const WorkoutForm: React.FC<Props> = ({ visible, editing, onCancel, onSubmit }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			if (editing) {
				form.setFieldsValue({ ...editing, date: editing.date ? moment(editing.date) : undefined });
			} else {
				form.setFieldsValue({ exerciseType: 'Cardio', status: 'Completed', date: moment() });
			}
		}
	}, [visible, editing]);

	const handleOk = () => {
		form.validateFields().then((v) => {
			onSubmit({ ...v, date: v.date?.format('YYYY-MM-DD') });
			form.resetFields();
		});
	};

	return (
		<Modal
			title={editing ? 'Edit Workout' : 'Add Workout'}
			open={visible}
			onCancel={onCancel}
			onOk={handleOk}
			destroyOnClose
		>
			<Form form={form} layout='vertical' preserve={false}>
				<Form.Item name='exerciseName' label='Exercise Name' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name='exerciseType' label='Type' rules={[{ required: true }]}>
					<Select options={exerciseTypes.map((t) => ({ value: t, label: t }))} />
				</Form.Item>
				<Form.Item name='date' label='Date' rules={[{ required: true }]}>
					<DatePicker style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='duration' label='Duration (min)' rules={[{ required: true }]}>
					<InputNumber min={1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='caloriesBurned' label='Calories Burned' rules={[{ required: true }]}>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='status' label='Status' rules={[{ required: true }]}>
					<Select options={statuses.map((s) => ({ value: s, label: s }))} />
				</Form.Item>
				<Form.Item name='notes' label='Notes'>
					<Input.TextArea rows={2} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default WorkoutForm;
