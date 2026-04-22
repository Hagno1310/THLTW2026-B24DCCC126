import { useEffect } from 'react';
import { Form, Input, Modal, Radio, Select } from 'antd';
import { slugify } from '@/services/PersonalBlog/data';

interface Props {
	visible: boolean;
	editing: PersonalBlog.Post | null;
	tags: PersonalBlog.Tag[];
	onCancel: () => void;
	onSubmit: (values: Partial<PersonalBlog.Post>) => void;
}

const PostFormModal: React.FC<Props> = ({ visible, editing, tags, onCancel, onSubmit }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			if (editing) {
				form.setFieldsValue(editing);
			} else {
				form.resetFields();
				form.setFieldsValue({ status: 'draft', tags: [], author: 'Admin' });
			}
		}
	}, [visible, editing]);

	const handleTitleBlur = () => {
		const currentSlug = form.getFieldValue('slug');
		const title = form.getFieldValue('title');
		if (!currentSlug && title) {
			form.setFieldsValue({ slug: slugify(title) });
		}
	};

	const featuredImage = Form.useWatch('featuredImage', form);

	return (
		<Modal
			visible={visible}
			title={editing ? 'Edit Post' : 'New Post'}
			onCancel={onCancel}
			onOk={() => form.validateFields().then(onSubmit)}
			okText={editing ? 'Save' : 'Create'}
			width={720}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='title' label='Title' rules={[{ required: true, message: 'Title is required' }]}>
					<Input onBlur={handleTitleBlur} />
				</Form.Item>
				<Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Slug is required' }]}>
					<Input placeholder='auto-generated from title' />
				</Form.Item>
				<Form.Item name='summary' label='Summary'>
					<Input.TextArea rows={2} placeholder='Short excerpt for cards' />
				</Form.Item>
				<Form.Item name='content' label='Content (Markdown)'>
					<Input.TextArea rows={12} placeholder='# Hello world' />
				</Form.Item>
				<Form.Item name='featuredImage' label='Featured Image URL'>
					<Input placeholder='https://…' />
				</Form.Item>
				{featuredImage && (
					<div style={{ marginBottom: 16 }}>
						<img src={featuredImage} alt='preview' style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 4 }} />
					</div>
				)}
				<Form.Item name='tags' label='Tags'>
					<Select
						mode='multiple'
						placeholder='Select tags'
						options={tags.map((t) => ({ value: t.id, label: t.name }))}
					/>
				</Form.Item>
				<Form.Item name='status' label='Status' rules={[{ required: true }]}>
					<Radio.Group>
						<Radio value='draft'>Draft</Radio>
						<Radio value='published'>Published</Radio>
					</Radio.Group>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default PostFormModal;
