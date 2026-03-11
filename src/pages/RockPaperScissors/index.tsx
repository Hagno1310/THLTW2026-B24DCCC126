import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Table, Space, Typography, Tag, Row, Col, Statistic } from 'antd';
import { TrophyOutlined, HistoryOutlined } from '@ant-design/icons';
import './style.less';

const { Title, Text } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';

interface GameHistory {
	key: number;
	playerChoice: Choice;
	computerChoice: Choice;
	result: Result;
	time: string;
}

const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

const RockPaperScissors: React.FC = () => {
	const [history, setHistory] = useState<GameHistory[]>([]);
	const [lastResult, setLastResult] = useState<GameHistory | null>(null);

	const getResult = (player: Choice, computer: Choice): Result => {
		if (player === computer) return 'Hòa';
		if (
			(player === 'Búa' && computer === 'Kéo') ||
			(player === 'Kéo' && computer === 'Bao') ||
			(player === 'Bao' && computer === 'Búa')
		) {
			return 'Thắng';
		}
		return 'Thua';
	};

	const play = (playerChoice: Choice) => {
		const computerChoice = choices[Math.floor(Math.random() * choices.length)];
		const result = getResult(playerChoice, computerChoice);
		const newResult: GameHistory = {
			key: Date.now(),
			playerChoice,
			computerChoice,
			result,
			time: new Date().toLocaleTimeString(),
		};

		setLastResult(newResult);
		setHistory([newResult, ...history]);
	};

	const columns = [
		{
			title: 'Thời gian',
			dataIndex: 'time',
			key: 'time',
		},
		{
			title: 'Bạn chọn',
			dataIndex: 'playerChoice',
			key: 'playerChoice',
			render: (choice: Choice) => (
				<Tag color='blue' style={{ fontSize: '14px', padding: '4px 12px' }}>
					{choice}
				</Tag>
			),
		},
		{
			title: 'Máy chọn',
			dataIndex: 'computerChoice',
			key: 'computerChoice',
			render: (choice: Choice) => (
				<Tag color='orange' style={{ fontSize: '14px', padding: '4px 12px' }}>
					{choice}
				</Tag>
			),
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			key: 'result',
			render: (result: Result) => {
				let color = 'default';
				if (result === 'Thắng') color = 'success';
				if (result === 'Thua') color = 'error';
				if (result === 'Hòa') color = 'warning';
				return (
					<Tag color={color} style={{ fontSize: '14px', fontWeight: 'bold' }}>
						{result}
					</Tag>
				);
			},
		},
	];

	const stats = {
		total: history.length,
		wins: history.filter((h) => h.result === 'Thắng').length,
		loses: history.filter((h) => h.result === 'Thua').length,
		draws: history.filter((h) => h.result === 'Hòa').length,
	};

	return (
		<PageContainer>
			<div className='rps-container'>
				<Card bordered={false} className='main-card'>
					<Row gutter={24} justify='center' align='middle'>
						<Col span={24} style={{ textAlign: 'center', marginBottom: '40px' }}>
							<Space size='large'>
								{choices.map((choice) => (
									<Button
										key={choice}
										type='primary'
										size='large'
										shape='round'
										className={`choice-btn ${choice}`}
										onClick={() => play(choice)}
										style={{ height: '80px', width: '120px', fontSize: '20px' }}
									>
										{choice}
									</Button>
								))}
							</Space>
						</Col>
					</Row>

					{lastResult && (
						<div className='result-display' style={{ marginBottom: '40px' }}>
							<Card className='result-card' style={{ background: '#f0f2f5' }}>
								<Row gutter={16} align='middle' justify='center'>
									<Col span={8} style={{ textAlign: 'right' }}>
										<Text type='secondary'>Bạn</Text>
										<Title level={4} style={{ margin: 0 }}>
											{lastResult.playerChoice}
										</Title>
									</Col>
									<Col span={4} style={{ textAlign: 'center' }}>
										<Title level={2} style={{ margin: 0 }}>
											VS
										</Title>
									</Col>
									<Col span={8} style={{ textAlign: 'left' }}>
										<Text type='secondary'>Máy tính</Text>
										<Title level={4} style={{ margin: 0 }}>
											{lastResult.computerChoice}
										</Title>
									</Col>
								</Row>
								<div style={{ textAlign: 'center', marginTop: '20px' }}>
									<Title
										level={1}
										style={{ margin: 0 }}
										type={
											lastResult.result === 'Thắng' ? 'success' : lastResult.result === 'Thua' ? 'danger' : 'warning'
										}
									>
										{lastResult.result}!
									</Title>
								</div>
							</Card>
						</div>
					)}

					<Row gutter={16}>
						<Col xs={24} sm={12} md={6}>
							<Card size='small' className='stat-card'>
								<Statistic title='Tổng số ván' value={stats.total} prefix={<HistoryOutlined />} />
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card size='small' className='stat-card'>
								<Statistic
									title='Thắng'
									value={stats.wins}
									valueStyle={{ color: '#3f8600' }}
									prefix={<TrophyOutlined />}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card size='small' className='stat-card'>
								<Statistic title='Thua' value={stats.loses} valueStyle={{ color: '#cf1322' }} />
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card size='small' className='stat-card'>
								<Statistic title='Hòa' value={stats.draws} valueStyle={{ color: '#faad14' }} />
							</Card>
						</Col>
					</Row>

					<div style={{ marginTop: '40px' }}>
						<Title level={4}>Lịch sử ván đấu</Title>
						<Table dataSource={history} columns={columns} pagination={{ pageSize: 5 }} />
					</div>
				</Card>
			</div>
		</PageContainer>
	);
};

export default RockPaperScissors;
