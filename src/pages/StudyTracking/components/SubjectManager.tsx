import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Subject {
	id: string;
	name: string;
}

interface Props {
	subjects: Subject[];
	setSubjects: (subjects: Subject[]) => void;
}

const SubjectManager: React.FC<Props> = ({ subjects, setSubjects }) => {
	const [visible, setVisible] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [form] = Form.useForm();

	const handleOpenModal = (subject?: Subject) => {
		if (subject) {
			setEditingSubject(subject);
			form.setFieldsValue(subject);
		} else {
			setEditingSubject(null);
			form.resetFields();
		}
		setVisible(true);
	};

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			if (editingSubject) {
				const newSubjects = subjects.map((s) => (s.id === editingSubject.id ? { ...s, name: values.name } : s));
				setSubjects(newSubjects);
				message.success('Cập nhật môn học thành công');
			} else {
				const newSubject = {
					id: Date.now().toString(),
					name: values.name,
				};
				setSubjects([...subjects, newSubject]);
				message.success('Thêm môn học thành công');
			}
			setVisible(false);
		});
	};

	const handleDelete = (id: string) => {
		setSubjects(subjects.filter((s) => s.id !== id));
		message.success('Xóa môn học thành công');
	};

	const columns = [
		{
			title: 'Tên môn học',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 150,
			align: 'center' as const,
			render: (_: any, record: Subject) => (
				<Space size='middle'>
					<Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} type='link' />
					<Popconfirm title='Bạn có chắc chắn muốn xóa môn học này?' onConfirm={() => handleDelete(record.id)}>
						<Button icon={<DeleteOutlined />} type='link' danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='subject-manager'>
			<div style={{ marginBottom: 16 }}>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
					Thêm môn học mới
				</Button>
			</div>

			<Table dataSource={subjects} columns={columns} rowKey='id' pagination={{ pageSize: 5 }} bordered size='middle' />

			<Modal
				title={editingSubject ? 'Sửa môn học' : 'Thêm môn học mới'}
				visible={visible}
				onOk={handleSubmit}
				onCancel={() => setVisible(false)}
				destroyOnClose
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên môn học' rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}>
						<Input placeholder='Ví dụ: Toán, Văn, Anh...' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default SubjectManager;
