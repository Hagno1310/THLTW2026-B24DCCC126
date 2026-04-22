import { useEffect, useMemo, useState } from 'react';
import { Col, Input, Pagination, Row, Tag } from 'antd';
import debounce from 'lodash.debounce';
import { useModel } from 'umi';
import { Format } from '@/utils/utils';
import { initBlogMockData } from '@/services/PersonalBlog/data';
import ArticleCard from './ArticleCard';
import './style.less';

const { CheckableTag } = Tag;
const PAGE_SIZE = 9;

const Home: React.FC = () => {
	const { posts, tags, loadPosts, loadTags } = useModel('personalBlog');
	const [searchInput, setSearchInput] = useState('');
	const [debouncedTerm, setDebouncedTerm] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [page, setPage] = useState(1);

	useEffect(() => {
		initBlogMockData();
		loadPosts();
		loadTags();
	}, []);

	const debouncedSetTerm = useMemo(() => debounce((v: string) => setDebouncedTerm(v), 300), []);

	useEffect(() => {
		return () => debouncedSetTerm.cancel();
	}, [debouncedSetTerm]);

	const onSearch = (v: string) => {
		setSearchInput(v);
		debouncedSetTerm(v);
		setPage(1);
	};

	const toggleTag = (tagId: string, checked: boolean) => {
		setSelectedTags((prev) => (checked ? [...prev, tagId] : prev.filter((id) => id !== tagId)));
		setPage(1);
	};

	const filteredPosts = useMemo(() => {
		const term = Format(debouncedTerm);
		return posts
			.filter((p) => p.status === 'published')
			.filter((p) => (selectedTags.length ? p.tags.some((t) => selectedTags.includes(t)) : true))
			.filter((p) => {
				if (!term) return true;
				return Format(p.title).includes(term) || Format(p.summary).includes(term);
			});
	}, [posts, selectedTags, debouncedTerm]);

	const paged = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const tagMap = Object.fromEntries(tags.map((t) => [t.id, t]));

	return (
		<div className='pb-home'>
			<div className='pb-home__header'>
				<h1>Personal Blog</h1>
				<p>Notes on web development, TypeScript, and the occasional life update.</p>
			</div>

			<div className='pb-home__toolbar'>
				<Input.Search
					placeholder='Search by title or summary…'
					value={searchInput}
					onChange={(e) => onSearch(e.target.value)}
					allowClear
				/>
			</div>

			<div className='pb-home__tag-row'>
				{tags.map((t) => (
					<CheckableTag
						key={t.id}
						checked={selectedTags.includes(t.id)}
						onChange={(checked) => toggleTag(t.id, checked)}
					>
						{t.name}
					</CheckableTag>
				))}
			</div>

			{selectedTags.length > 0 && (
				<div className='pb-home__selected-chips'>
					{selectedTags.map((id) => (
						<Tag key={id} closable color='blue' onClose={() => toggleTag(id, false)}>
							{tagMap[id]?.name ?? id}
						</Tag>
					))}
				</div>
			)}

			{paged.length === 0 ? (
				<div className='pb-home__empty'>No articles match your filters.</div>
			) : (
				<Row gutter={[16, 16]}>
					{paged.map((post) => (
						<Col xs={24} sm={12} lg={8} key={post.id}>
							<ArticleCard post={post} tags={tags} />
						</Col>
					))}
				</Row>
			)}

			{filteredPosts.length > PAGE_SIZE && (
				<div className='pb-home__pagination'>
					<Pagination
						current={page}
						total={filteredPosts.length}
						pageSize={PAGE_SIZE}
						onChange={setPage}
						showSizeChanger={false}
					/>
				</div>
			)}
		</div>
	);
};

export default Home;
