import { Avatar, Card, Space, Tag } from 'antd';
import { GithubOutlined, MailOutlined, GlobalOutlined, LinkOutlined } from '@ant-design/icons';
import { AUTHOR } from '@/services/PersonalBlog/author';

const iconFor = (label: string) => {
	const l = label.toLowerCase();
	if (l.includes('github')) return <GithubOutlined />;
	if (l.includes('email') || l.includes('mail')) return <MailOutlined />;
	if (l.includes('web') || l.includes('site')) return <GlobalOutlined />;
	return <LinkOutlined />;
};

const About: React.FC = () => {
	return (
		<div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
			<Card>
				<div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
					<Avatar size={96} src={AUTHOR.avatar} />
					<div style={{ flex: 1, minWidth: 220 }}>
						<h1 style={{ margin: 0 }}>{AUTHOR.name}</h1>
						<p style={{ color: 'rgba(0,0,0,0.65)', marginTop: 8 }}>{AUTHOR.bio}</p>
					</div>
				</div>

				<div style={{ marginTop: 24 }}>
					<h3>Skills</h3>
					<Space size={[6, 8]} wrap>
						{AUTHOR.skills.map((s) => (
							<Tag key={s} color='blue'>
								{s}
							</Tag>
						))}
					</Space>
				</div>

				<div style={{ marginTop: 24 }}>
					<h3>Find me online</h3>
					<Space direction='vertical'>
						{AUTHOR.socials.map((s) => (
							<a key={s.label} href={s.url} target='_blank' rel='noreferrer'>
								{iconFor(s.label)} <span style={{ marginLeft: 8 }}>{s.label}</span>
							</a>
						))}
					</Space>
				</div>
			</Card>
		</div>
	);
};

export default About;
