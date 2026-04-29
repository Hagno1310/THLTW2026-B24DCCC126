import { DatePicker, Drawer, Form, Input, InputNumber, Select } from 'antd';
import { Button } from 'antd';

const goalTypes: FitnessHealth.GoalType[] = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General'];

interface Props {
	visible: boolean;
	onClose: () => void;
	onSubmit: (values: any) => void;
}

const GoalDrawerForm: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
	const [form] = Form.useForm();

	const handleFinish = () => {
		form.validateFields().then((v) => {
			onSubmit({ ...v, deadline: v.deadline?.format('YYYY-MM-DD') });
			form.resetFields();
			onClose();
		});
	};

	return (
		<Drawer
			title='Add Goal'
			placement='right'
			width={480}
			open={visible}
			onClose={onClose}
			extra={
				<Button type='primary' onClick={handleFinish}>
					Save
				</Button>
			}
		>
			<Form form={form} layout='vertical' preserve={false} initialValues={{ type: 'General', current: 0 }}>
				<Form.Item name='name' label='Goal Name' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name='type' label='Type' rules={[{ required: true }]}>
					<Select options={goalTypes.map((t) => ({ value: t, label: t }))} />
				</Form.Item>
				<Form.Item name='target' label='Target' rules={[{ required: true }]}>
					<InputNumber min={1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='current' label='Current'>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='unit' label='Unit' rules={[{ required: true }]}>
					<Input placeholder='e.g. kg, km, days' />
				</Form.Item>
				<Form.Item name='deadline' label='Deadline' rules={[{ required: true }]}>
					<DatePicker style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Drawer>
	);
};

export default GoalDrawerForm;
