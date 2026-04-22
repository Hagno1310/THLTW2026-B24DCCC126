import { Card, Tag } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import { toHexa } from '@/utils/utils';

interface Props {
	post: PersonalBlog.Post;
	tags: PersonalBlog.Tag[];
}

const ArticleCard: React.FC<Props> = ({ post, tags }) => {
	const tagMap = Object.fromEntries(tags.map((t) => [t.id, t]));

	return (
		<Card
			hoverable
			className='pb-article-card'
			cover={
				<div className='pb-article-card__cover'>
					<img alt={post.title} src={post.featuredImage} />
				</div>
			}
			onClick={() => history.push(`/personal-blog/article/${post.slug}`)}
		>
			<div className='pb-article-card__tags'>
				{post.tags.map((tid) => {
					const t = tagMap[tid];
					if (!t) return null;
					return (
						<Tag key={tid} color={toHexa(t.name)}>
							{t.name}
						</Tag>
					);
				})}
			</div>
			<h3 className='pb-article-card__title'>{post.title}</h3>
			<p className='pb-article-card__summary'>{post.summary}</p>
			<div className='pb-article-card__meta'>
				<span>{post.author}</span>
				<span>·</span>
				<span>{post.publishedAt ? moment(post.publishedAt).format('DD/MM/YYYY') : '—'}</span>
			</div>
		</Card>
	);
};

export default ArticleCard;
