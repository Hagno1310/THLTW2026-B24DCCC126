import { Descriptions, Modal, Tag } from 'antd';

const difficultyColor: Record<FitnessHealth.Difficulty, string> = { Easy: 'green', Medium: 'orange', Hard: 'red' };

interface Props {
	exercise: FitnessHealth.Exercise | null;
	onClose: () => void;
}

const ExerciseDetailModal: React.FC<Props> = ({ exercise, onClose }) => {
	if (!exercise) return null;
	return (
		<Modal title={exercise.name} open={!!exercise} onCancel={onClose} footer={null} width={600}>
			<Descriptions column={1} bordered size='small'>
				<Descriptions.Item label='Muscle Group'>{exercise.muscleGroup}</Descriptions.Item>
				<Descriptions.Item label='Difficulty'>
					<Tag color={difficultyColor[exercise.difficulty]}>{exercise.difficulty}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Avg Calories/Hour'>{exercise.avgCaloriesPerHour}</Descriptions.Item>
				<Descriptions.Item label='Description'>{exercise.description}</Descriptions.Item>
				<Descriptions.Item label='Instructions'>
					<div style={{ whiteSpace: 'pre-wrap' }}>{exercise.instructions}</div>
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ExerciseDetailModal;
