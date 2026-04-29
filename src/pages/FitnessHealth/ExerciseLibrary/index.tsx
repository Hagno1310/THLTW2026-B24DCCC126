import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Input, Popconfirm, Row, Select, Space, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import ExerciseForm from './ExerciseForm';
import ExerciseDetailModal from './ExerciseDetailModal';
import './style.less';

const muscleGroups: FitnessHealth.MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Full Body'];
const difficulties: FitnessHealth.Difficulty[] = ['Easy', 'Medium', 'Hard'];
const difficultyColor: Record<FitnessHealth.Difficulty, string> = { Easy: 'green', Medium: 'orange', Hard: 'red' };

const ExerciseLibrary: React.FC = () => {
	const { exercises, loadExercises, createExercise, updateExercise, deleteExercise } = useModel('fitnessHealth');
	const [search, setSearch] = useState('');
	const [muscleFilter, setMuscleFilter] = useState<string>('all');
	const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
	const [formVisible, setFormVisible] = useState(false);
	const [editing, setEditing] = useState<FitnessHealth.Exercise | null>(null);
	const [detail, setDetail] = useState<FitnessHealth.Exercise | null>(null);

	useEffect(() => {
		loadExercises();
	}, []);

	const filtered = useMemo(() => {
		const term = search.toLowerCase();
		return exercises
			.filter((e) => (term ? e.name.toLowerCase().includes(term) : true))
			.filter((e) => (muscleFilter !== 'all' ? e.muscleGroup === muscleFilter : true))
			.filter((e) => (difficultyFilter !== 'all' ? e.difficulty === difficultyFilter : true));
	}, [exercises, search, muscleFilter, difficultyFilter]);

	const handleSubmit = (values: Partial<FitnessHealth.Exercise>) => {
		if (editing) updateExercise(editing.id, values);
		else createExercise(values);
		setFormVisible(false);
		setEditing(null);
	};

	return (
		<div className='fh-exercises'>
			<div className='fh-exercises__toolbar'>
				<h2>Exercise Library</h2>
				<Input.Search
					placeholder='Search by name...'
					allowClear
					style={{ width: 220 }}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Select
					value={muscleFilter}
					onChange={setMuscleFilter}
					style={{ width: 150 }}
					options={[{ value: 'all', label: 'All Muscles' }, ...muscleGroups.map((m) => ({ value: m, label: m }))]}
				/>
				<Select
					value={difficultyFilter}
					onChange={setDifficultyFilter}
					style={{ width: 140 }}
					options={[{ value: 'all', label: 'All Levels' }, ...difficulties.map((d) => ({ value: d, label: d }))]}
				/>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setEditing(null);
						setFormVisible(true);
					}}
				>
					Add Exercise
				</Button>
			</div>

			{filtered.length === 0 ? (
				<div className='fh-exercises__empty'>No exercises match your filters.</div>
			) : (
				<Row gutter={[16, 16]}>
					{filtered.map((ex) => (
						<Col xs={24} sm={12} lg={8} key={ex.id}>
							<Card
								hoverable
								className='fh-exercise-card'
								onClick={() => setDetail(ex)}
								title={ex.name}
								extra={
									<Space onClick={(e) => e.stopPropagation()}>
										<Button
											size='small'
											type='text'
											icon={<EditOutlined />}
											onClick={() => {
												setEditing(ex);
												setFormVisible(true);
											}}
										/>
										<Popconfirm
											title='Delete this exercise?'
											okText='Delete'
											okButtonProps={{ danger: true }}
											onConfirm={() => deleteExercise(ex.id)}
										>
											<Button size='small' danger type='text' icon={<DeleteOutlined />} />
										</Popconfirm>
									</Space>
								}
							>
								<div className='fh-exercise-card__tags'>
									<Tag color={difficultyColor[ex.difficulty]}>{ex.difficulty}</Tag>
									<Tag>{ex.muscleGroup}</Tag>
								</div>
								<p className='fh-exercise-card__desc'>{ex.description}</p>
								<p className='fh-exercise-card__cal'>~{ex.avgCaloriesPerHour} cal/hr</p>
							</Card>
						</Col>
					))}
				</Row>
			)}

			<ExerciseForm
				visible={formVisible}
				editing={editing}
				onCancel={() => {
					setFormVisible(false);
					setEditing(null);
				}}
				onSubmit={handleSubmit}
			/>
			<ExerciseDetailModal exercise={detail} onClose={() => setDetail(null)} />
		</div>
	);
};

export default ExerciseLibrary;
