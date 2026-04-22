declare namespace PersonalBlog {
	type PostStatus = 'draft' | 'published';

	interface Post {
		id: string;
		title: string;
		slug: string;
		summary: string;
		content: string;
		featuredImage: string;
		tags: string[];
		status: PostStatus;
		author: string;
		publishedAt: string;
		createdAt: string;
		views: number;
	}

	interface Tag {
		id: string;
		name: string;
		slug: string;
	}

	interface Social {
		label: string;
		url: string;
	}

	interface Author {
		name: string;
		avatar: string;
		bio: string;
		skills: string[];
		socials: Social[];
	}
}
