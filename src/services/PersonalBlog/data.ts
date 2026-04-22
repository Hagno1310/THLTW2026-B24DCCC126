import { Format } from '@/utils/utils';

export const STORAGE_KEYS = {
	posts: 'pb_posts',
	tags: 'pb_tags',
};

export const slugify = (text: string): string => {
	if (!text) return '';
	return Format(text)
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
};

export const genId = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const seedTags: PersonalBlog.Tag[] = [
	{ id: 't1', name: 'Web Dev', slug: 'web-dev' },
	{ id: 't2', name: 'React', slug: 'react' },
	{ id: 't3', name: 'TypeScript', slug: 'typescript' },
	{ id: 't4', name: 'Life', slug: 'life' },
	{ id: 't5', name: 'Tutorial', slug: 'tutorial' },
];

const seedPosts: PersonalBlog.Post[] = [
	{
		id: 'p1',
		title: 'Getting Started with React Hooks',
		slug: 'getting-started-with-react-hooks',
		summary: 'A beginner-friendly tour of useState, useEffect, and when to reach for a custom hook.',
		content:
			'# Getting Started with React Hooks\n\nHooks let you use state and other React features without writing a class.\n\n## useState\n\n```tsx\nconst [count, setCount] = useState(0);\n```\n\n## useEffect\n\nRun side effects after render.\n\n- Fetch data\n- Subscribe to events\n- Update the DOM\n\n> Tip: keep hook calls at the top level of your component.',
		featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
		tags: ['t1', 't2'],
		status: 'published',
		author: 'Admin',
		publishedAt: '2026-04-01T09:00:00.000Z',
		createdAt: '2026-03-30T09:00:00.000Z',
		views: 128,
	},
	{
		id: 'p2',
		title: 'TypeScript Tips for Everyday React',
		slug: 'typescript-tips-for-everyday-react',
		summary: 'Small tricks that make your React + TS codebase less painful over time.',
		content:
			'# TypeScript Tips for Everyday React\n\n1. Prefer `type` aliases for unions.\n2. Use `as const` for readonly literals.\n3. Extract prop types with `React.ComponentProps<typeof Foo>`.\n\n```ts\ntype Status = "idle" | "loading" | "done";\n```\n\nHappy typing!',
		featuredImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
		tags: ['t2', 't3', 't5'],
		status: 'published',
		author: 'Admin',
		publishedAt: '2026-04-05T09:00:00.000Z',
		createdAt: '2026-04-04T09:00:00.000Z',
		views: 97,
	},
	{
		id: 'p3',
		title: 'Designing a Personal Blog with UmiJS',
		slug: 'designing-a-personal-blog-with-umijs',
		summary: 'How I structured routes, models, and pages to ship a simple blog without a backend.',
		content:
			'# Designing a Personal Blog with UmiJS\n\nUmiJS auto-discovers files in `src/models/` and `src/pages/`, which keeps configuration minimal.\n\n## Routes\n\nGrouping pages under one parent route gives a tidy sidebar.\n\n## Persistence\n\nThis blog uses `localStorage` — perfect for small assignments.',
		featuredImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
		tags: ['t1', 't5'],
		status: 'published',
		author: 'Admin',
		publishedAt: '2026-04-10T09:00:00.000Z',
		createdAt: '2026-04-09T09:00:00.000Z',
		views: 54,
	},
	{
		id: 'p4',
		title: 'Notes on Focus and Slow Coding',
		slug: 'notes-on-focus-and-slow-coding',
		summary: 'Why taking your time often produces cleaner code than sprinting through a feature.',
		content:
			'# Notes on Focus and Slow Coding\n\nWriting fewer lines on purpose is a skill.\n\n- Read the surrounding code first.\n- Sketch the data flow.\n- Delete what you do not need.\n\n> "Make it work, make it right, make it fast." — Kent Beck',
		featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
		tags: ['t4'],
		status: 'published',
		author: 'Admin',
		publishedAt: '2026-04-12T09:00:00.000Z',
		createdAt: '2026-04-11T09:00:00.000Z',
		views: 31,
	},
	{
		id: 'p5',
		title: 'Markdown Cheatsheet for Writers',
		slug: 'markdown-cheatsheet-for-writers',
		summary: 'All the Markdown you need to write a decent blog post — nothing more.',
		content:
			'# Markdown Cheatsheet\n\n## Headings\n\n`# H1`, `## H2`, `### H3`\n\n## Emphasis\n\n*italic*, **bold**, ~~strike~~\n\n## Lists\n\n- one\n- two\n- three\n\n## Code\n\n```js\nconsole.log("hello");\n```',
		featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
		tags: ['t5', 't1'],
		status: 'published',
		author: 'Admin',
		publishedAt: '2026-04-15T09:00:00.000Z',
		createdAt: '2026-04-14T09:00:00.000Z',
		views: 12,
	},
	{
		id: 'p6',
		title: 'A Draft: Ideas for Next Quarter',
		slug: 'a-draft-ideas-for-next-quarter',
		summary: 'Rough notes on what I want to learn and ship over the next three months.',
		content:
			'# Draft — ideas for next quarter\n\n- Dive deeper into testing.\n- Build one small tool per month.\n- Read more source code.',
		featuredImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800',
		tags: ['t4'],
		status: 'draft',
		author: 'Admin',
		publishedAt: '',
		createdAt: '2026-04-20T09:00:00.000Z',
		views: 0,
	},
];

export const getPosts = (): PersonalBlog.Post[] => {
	const raw = localStorage.getItem(STORAGE_KEYS.posts);
	return raw ? JSON.parse(raw) : [];
};

export const savePosts = (posts: PersonalBlog.Post[]) => {
	localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
};

export const getTags = (): PersonalBlog.Tag[] => {
	const raw = localStorage.getItem(STORAGE_KEYS.tags);
	return raw ? JSON.parse(raw) : [];
};

export const saveTags = (tags: PersonalBlog.Tag[]) => {
	localStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(tags));
};

export const initBlogMockData = () => {
	if (!localStorage.getItem(STORAGE_KEYS.tags)) {
		localStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(seedTags));
	}
	if (!localStorage.getItem(STORAGE_KEYS.posts)) {
		localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(seedPosts));
	}
};

export const incrementViews = (id: string) => {
	const posts = getPosts();
	const next = posts.map((p) => (p.id === id ? { ...p, views: (p.views ?? 0) + 1 } : p));
	savePosts(next);
	return next;
};
