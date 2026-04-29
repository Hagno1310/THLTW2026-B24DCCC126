import { useEffect } from 'react';
import { DatePicker, Form, InputNumber, Modal } from 'antd';
import moment from 'moment';

interface Props {
	visible: boolean;
	editing: FitnessHealth.HealthLog | null;
	onCancel: () => void;
	onSubmit: (values: any) => void;
}

const HealthForm: React.FC<Props> = ({ visible, editing, onCancel, onSubmit }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			if (editing) {
				form.setFieldsValue({ ...editing, date: editing.date ? moment(editing.date) : undefined });
			} else {
				form.setFieldsValue({ date: moment(), height: 175 });
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
			title={editing ? 'Edit Health Record' : 'Add Health Record'}
			open={visible}
			onCancel={onCancel}
			onOk={handleOk}
			destroyOnClose
		>
			<Form form={form} layout='vertical' preserve={false}>
				<Form.Item name='date' label='Date' rules={[{ required: true }]}>
					<DatePicker style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='weight' label='Weight (kg)' rules={[{ required: true }]}>
					<InputNumber min={1} max={500} step={0.1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='height' label='Height (cm)' rules={[{ required: true }]}>
					<InputNumber min={50} max={300} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='heartRate' label='Heart Rate (bpm)' rules={[{ required: true }]}>
					<InputNumber min={30} max={250} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='sleepHours' label='Sleep Hours' rules={[{ required: true }]}>
					<InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default HealthForm;
