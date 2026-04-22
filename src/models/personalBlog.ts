import { useState } from 'react';
import { getPosts, savePosts, getTags, saveTags, incrementViews, genId, slugify } from '@/services/PersonalBlog/data';

export default () => {
	const [posts, setPosts] = useState<PersonalBlog.Post[]>([]);
	const [tags, setTags] = useState<PersonalBlog.Tag[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const loadPosts = () => {
		setLoading(true);
		const data = getPosts();
		setPosts(data);
		setLoading(false);
		return data;
	};

	const loadTags = () => {
		const data = getTags();
		setTags(data);
		return data;
	};

	const createPost = (data: Partial<PersonalBlog.Post>) => {
		const now = new Date().toISOString();
		const post: PersonalBlog.Post = {
			id: genId(),
			title: data.title ?? '',
			slug: data.slug || slugify(data.title ?? ''),
			summary: data.summary ?? '',
			content: data.content ?? '',
			featuredImage: data.featuredImage ?? '',
			tags: data.tags ?? [],
			status: data.status ?? 'draft',
			author: data.author ?? 'Admin',
			publishedAt: data.status === 'published' ? now : '',
			createdAt: now,
			views: 0,
		};
		const next = [post, ...getPosts()];
		savePosts(next);
		setPosts(next);
		return post;
	};

	const updatePost = (id: string, data: Partial<PersonalBlog.Post>) => {
		const current = getPosts();
		const next = current.map((p) => {
			if (p.id !== id) return p;
			const merged = { ...p, ...data };
			if (data.status === 'published' && !p.publishedAt) {
				merged.publishedAt = new Date().toISOString();
			}
			return merged;
		});
		savePosts(next);
		setPosts(next);
	};

	const deletePost = (id: string) => {
		const next = getPosts().filter((p) => p.id !== id);
		savePosts(next);
		setPosts(next);
	};

	const createTag = (data: { name: string }) => {
		const tag: PersonalBlog.Tag = {
			id: genId(),
			name: data.name,
			slug: slugify(data.name),
		};
		const next = [...getTags(), tag];
		saveTags(next);
		setTags(next);
		return tag;
	};

	const updateTag = (id: string, data: { name: string }) => {
		const next = getTags().map((t) => (t.id === id ? { ...t, name: data.name, slug: slugify(data.name) } : t));
		saveTags(next);
		setTags(next);
	};

	const deleteTag = (id: string) => {
		const nextTags = getTags().filter((t) => t.id !== id);
		saveTags(nextTags);
		setTags(nextTags);
		// strip the tag id from any post that referenced it
		const nextPosts = getPosts().map((p) => ({ ...p, tags: p.tags.filter((tid) => tid !== id) }));
		savePosts(nextPosts);
		setPosts(nextPosts);
	};

	const incrementView = (id: string) => {
		const next = incrementViews(id);
		setPosts(next);
	};

	return {
		posts,
		tags,
		loading,
		loadPosts,
		loadTags,
		createPost,
		updatePost,
		deletePost,
		createTag,
		updateTag,
		deleteTag,
		incrementView,
	};
};
