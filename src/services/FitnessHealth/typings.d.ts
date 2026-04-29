declare namespace FitnessHealth {
	type ExerciseType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
	type WorkoutStatus = 'Completed' | 'Missed';
	type GoalType = 'Weight Loss' | 'Muscle Gain' | 'Endurance' | 'Flexibility' | 'General';
	type GoalStatus = 'In Progress' | 'Achieved' | 'Cancelled';
	type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Arms' | 'Shoulders' | 'Core' | 'Full Body';
	type Difficulty = 'Easy' | 'Medium' | 'Hard';

	interface Workout {
		id: string;
		exerciseName: string;
		exerciseType: ExerciseType;
		duration: number; // minutes
		caloriesBurned: number;
		date: string;
		notes: string;
		status: WorkoutStatus;
	}

	interface HealthLog {
		id: string;
		date: string;
		weight: number; // kg
		height: number; // cm
		bmi: number;
		heartRate: number; // bpm
		sleepHours: number;
	}

	interface Goal {
		id: string;
		name: string;
		type: GoalType;
		status: GoalStatus;
		target: number;
		current: number;
		unit: string;
		deadline: string;
		createdAt: string;
	}

	interface Exercise {
		id: string;
		name: string;
		muscleGroup: MuscleGroup;
		difficulty: Difficulty;
		description: string;
		instructions: string;
		avgCaloriesPerHour: number;
	}
}
