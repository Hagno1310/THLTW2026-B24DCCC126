import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import moment from 'moment';
import { useModel } from 'umi';
import { Format } from '@/utils/utils';
import { initBlogMockData } from '@/services/PersonalBlog/data';
import PostFormModal from './PostFormModal';

const PostManagement: React.FC = () => {
	const { posts, tags, loadPosts, loadTags, createPost, updatePost, deletePost } = useModel('personalBlog');
	const [searchInput, setSearchInput] = useState('');
	const [debouncedTerm, setDebouncedTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | PersonalBlog.PostStatus>('all');
	const [modalVisible, setModalVisible] = useState(false);
	const [editing, setEditing] = useState<PersonalBlog.Post | null>(null);

	useEffect(() => {
		initBlogMockData();
		loadPosts();
		loadTags();
	}, []);

	const debouncedSetTerm = useMemo(() => debounce((v: string) => setDebouncedTerm(v), 300), []);
	useEffect(() => () => debouncedSetTerm.cancel(), [debouncedSetTerm]);

	const tagMap = Object.fromEntries(tags.map((t) => [t.id, t]));

	const filtered = useMemo(() => {
		const term = Format(debouncedTerm);
		return posts
			.filter((p) => (statusFilter === 'all' ? true : p.status === statusFilter))
			.filter((p) => (term ? Format(p.title).includes(term) : true));
	}, [posts, debouncedTerm, statusFilter]);

	const openCreate = () => {
		setEditing(null);
		setModalVisible(true);
	};

	const openEdit = (post: PersonalBlog.Post) => {
		setEditing(post);
		setModalVisible(true);
	};

	const handleSubmit = (values: Partial<PersonalBlog.Post>) => {
		if (editing) {
			updatePost(editing.id, values);
		} else {
			createPost(values);
		}
		setModalVisible(false);
		setEditing(null);
	};

	const columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			render: (title: string, record: PersonalBlog.Post) => (
				<div>
					<div style={{ fontWeight: 500 }}>{title}</div>
					<div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>/{record.slug}</div>
				</div>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (s: PersonalBlog.PostStatus) => <Tag color={s === 'published' ? 'green' : 'default'}>{s}</Tag>,
		},
		{
			title: 'Tags',
			dataIndex: 'tags',
			key: 'tags',
			render: (ids: string[]) => (
				<span>
					{ids
						.map((id) => tagMap[id]?.name)
						.filter(Boolean)
						.join(', ') || '—'}
				</span>
			),
		},
		{
			title: 'Views',
			dataIndex: 'views',
			key: 'views',
			width: 90,
			sorter: (a: PersonalBlog.Post, b: PersonalBlog.Post) => a.views - b.views,
		},
		{
			title: 'Created',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 130,
			render: (d: string) => (d ? moment(d).format('DD/MM/YYYY') : '—'),
			sorter: (a: PersonalBlog.Post, b: PersonalBlog.Post) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 140,
			render: (_: any, record: PersonalBlog.Post) => (
				<Space>
					<Button size='small' icon={<EditOutlined />} onClick={() => openEdit(record)} />
					<Popconfirm
						title='Delete this post?'
						okText='Delete'
						okButtonProps={{ danger: true }}
						onConfirm={() => deletePost(record.id)}
					>
						<Button size='small' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 16 }}>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16, alignItems: 'center' }}>
				<h2 style={{ margin: 0, flex: 1 }}>Post Management</h2>
				<Input.Search
					placeholder='Search by title…'
					value={searchInput}
					onChange={(e) => {
						setSearchInput(e.target.value);
						debouncedSetTerm(e.target.value);
					}}
					allowClear
					style={{ width: 260 }}
				/>
				<Select
					value={statusFilter}
					onChange={setStatusFilter}
					style={{ width: 140 }}
					options={[
						{ value: 'all', label: 'All' },
						{ value: 'draft', label: 'Draft' },
						{ value: 'published', label: 'Published' },
					]}
				/>
				<Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
					Add new
				</Button>
			</div>

			<Table rowKey='id' columns={columns as any} dataSource={filtered} pagination={{ pageSize: 10 }} />

			<PostFormModal
				visible={modalVisible}
				editing={editing}
				tags={tags}
				onCancel={() => {
					setModalVisible(false);
					setEditing(null);
				}}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default PostManagement;
