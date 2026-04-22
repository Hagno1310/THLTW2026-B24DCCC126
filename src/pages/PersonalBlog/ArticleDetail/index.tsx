import { useEffect, useMemo, useRef } from 'react';
import { Button, Col, Row, Tag } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { history, useModel, useParams } from 'umi';
import { initBlogMockData } from '@/services/PersonalBlog/data';
import { toHexa } from '@/utils/utils';
import ArticleCard from '../Home/ArticleCard';
import '../Home/style.less';
import './style.less';

const ArticleDetail: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const { posts, tags, loadPosts, loadTags, incrementView } = useModel('personalBlog');
	const incrementedRef = useRef<string | null>(null);

	useEffect(() => {
		initBlogMockData();
		loadPosts();
		loadTags();
	}, []);

	const post = useMemo(() => posts.find((p) => p.slug === slug), [posts, slug]);

	useEffect(() => {
		if (post && incrementedRef.current !== post.id) {
			incrementedRef.current = post.id;
			incrementView(post.id);
		}
	}, [post?.id]);

	const related = useMemo(() => {
		if (!post) return [];
		return posts
			.filter((p) => p.id !== post.id && p.status === 'published' && p.tags.some((t) => post.tags.includes(t)))
			.slice(0, 3);
	}, [post, posts]);

	if (!post) {
		return (
			<div className='pb-article pb-article__not-found'>
				<h2>Article not found</h2>
				<p>The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
				<Button type='primary' onClick={() => history.push('/personal-blog/home')}>
					Back to Home
				</Button>
			</div>
		);
	}

	const tagMap = Object.fromEntries(tags.map((t) => [t.id, t]));

	return (
		<div className='pb-article'>
			<Button
				className='pb-article__back'
				icon={<ArrowLeftOutlined />}
				onClick={() => history.push('/personal-blog/home')}
			>
				Back to Home
			</Button>

			{post.featuredImage && <img className='pb-article__cover' src={post.featuredImage} alt={post.title} />}

			<h1 className='pb-article__title'>{post.title}</h1>

			<div className='pb-article__meta'>
				<span>{post.author}</span>
				<span>·</span>
				<span>{post.publishedAt ? moment(post.publishedAt).format('DD/MM/YYYY') : '—'}</span>
				<span>·</span>
				<span>
					<EyeOutlined /> {post.views} views
				</span>
			</div>

			<div className='pb-article__tags'>
				{post.tags.map((tid) => {
					const t = tagMap[tid];
					if (!t) return null;
					return (
						<Tag key={tid} color={toHexa(t.name)} style={{ color: '#fff', border: 'none' }}>
							{t.name}
						</Tag>
					);
				})}
			</div>

			<div className='pb-article__content'>
				<ReactMarkdown remarkPlugins={[remarkGfm as any]}>{post.content}</ReactMarkdown>
			</div>

			{related.length > 0 && (
				<div className='pb-article__related'>
					<h3>Related articles</h3>
					<Row gutter={[16, 16]}>
						{related.map((p) => (
							<Col xs={24} sm={12} lg={8} key={p.id}>
								<ArticleCard post={p} tags={tags} />
							</Col>
						))}
					</Row>
				</div>
			)}
		</div>
	);
};

export default ArticleDetail;
