import { useEffect, useMemo, useState } from 'react';
import { Button, Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { initBlogMockData } from '@/services/PersonalBlog/data';
import TagFormModal from './TagFormModal';

const TagManagement: React.FC = () => {
	const { tags, posts, loadTags, loadPosts, createTag, updateTag, deleteTag } = useModel('personalBlog');
	const [modalVisible, setModalVisible] = useState(false);
	const [editing, setEditing] = useState<PersonalBlog.Tag | null>(null);

	useEffect(() => {
		initBlogMockData();
		loadTags();
		loadPosts();
	}, []);

	const countByTag = useMemo(() => {
		const m: Record<string, number> = {};
		posts.forEach((p) => p.tags.forEach((t) => (m[t] = (m[t] ?? 0) + 1)));
		return m;
	}, [posts]);

	const openCreate = () => {
		setEditing(null);
		setModalVisible(true);
	};

	const openEdit = (tag: PersonalBlog.Tag) => {
		setEditing(tag);
		setModalVisible(true);
	};

	const handleSubmit = (values: { name: string }) => {
		if (editing) updateTag(editing.id, values);
		else createTag(values);
		setModalVisible(false);
		setEditing(null);
	};

	const columns = [
		{
			title: 'Tag Name',
			dataIndex: 'name',
			key: 'name',
			render: (name: string, r: PersonalBlog.Tag) => (
				<div>
					<div style={{ fontWeight: 500 }}>{name}</div>
					<div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>/{r.slug}</div>
				</div>
			),
		},
		{
			title: 'Posts Count',
			key: 'count',
			width: 140,
			render: (_: any, r: PersonalBlog.Tag) => countByTag[r.id] ?? 0,
			sorter: (a: PersonalBlog.Tag, b: PersonalBlog.Tag) => (countByTag[a.id] ?? 0) - (countByTag[b.id] ?? 0),
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 140,
			render: (_: any, record: PersonalBlog.Tag) => (
				<Space>
					<Button size='small' icon={<EditOutlined />} onClick={() => openEdit(record)} />
					<Popconfirm
						title='Delete this tag? It will also be removed from all posts.'
						okText='Delete'
						okButtonProps={{ danger: true }}
						onConfirm={() => deleteTag(record.id)}
					>
						<Button size='small' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 16 }}>
			<div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
				<h2 style={{ margin: 0, flex: 1 }}>Tag Management</h2>
				<Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
					Add Tag
				</Button>
			</div>

			<Table rowKey='id' columns={columns as any} dataSource={tags} pagination={{ pageSize: 10 }} />

			<TagFormModal
				visible={modalVisible}
				editing={editing}
				onCancel={() => {
					setModalVisible(false);
					setEditing(null);
				}}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default TagManagement;
