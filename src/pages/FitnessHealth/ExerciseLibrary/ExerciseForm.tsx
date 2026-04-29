import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select } from 'antd';

const muscleGroups: FitnessHealth.MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Full Body'];
const difficulties: FitnessHealth.Difficulty[] = ['Easy', 'Medium', 'Hard'];

interface Props {
	visible: boolean;
	editing: FitnessHealth.Exercise | null;
	onCancel: () => void;
	onSubmit: (values: Partial<FitnessHealth.Exercise>) => void;
}

const ExerciseForm: React.FC<Props> = ({ visible, editing, onCancel, onSubmit }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			form.setFieldsValue(editing ?? { muscleGroup: 'Full Body', difficulty: 'Medium', avgCaloriesPerHour: 300 });
		}
	}, [visible, editing]);

	return (
		<Modal
			title={editing ? 'Edit Exercise' : 'Add Exercise'}
			open={visible}
			onCancel={onCancel}
			onOk={() =>
				form.validateFields().then((v) => {
					onSubmit(v);
					form.resetFields();
				})
			}
			destroyOnClose
		>
			<Form form={form} layout='vertical' preserve={false}>
				<Form.Item name='name' label='Name' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name='muscleGroup' label='Muscle Group' rules={[{ required: true }]}>
					<Select options={muscleGroups.map((m) => ({ value: m, label: m }))} />
				</Form.Item>
				<Form.Item name='difficulty' label='Difficulty' rules={[{ required: true }]}>
					<Select options={difficulties.map((d) => ({ value: d, label: d }))} />
				</Form.Item>
				<Form.Item name='description' label='Description'>
					<Input.TextArea rows={2} />
				</Form.Item>
				<Form.Item name='instructions' label='Instructions'>
					<Input.TextArea rows={4} />
				</Form.Item>
				<Form.Item name='avgCaloriesPerHour' label='Avg Calories/Hour' rules={[{ required: true }]}>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ExerciseForm;
