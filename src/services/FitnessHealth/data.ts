export const STORAGE_KEYS = {
	workouts: 'FH_WORKOUTS',
	healthLogs: 'FH_HEALTH_LOGS',
	goals: 'FH_GOALS',
	exercises: 'FH_EXERCISES',
};

export const genId = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const seedWorkouts: FitnessHealth.Workout[] = [
	{
		id: 'w1',
		exerciseName: 'Morning Run',
		exerciseType: 'Cardio',
		duration: 30,
		caloriesBurned: 300,
		date: '2026-04-01',
		notes: 'Easy pace',
		status: 'Completed',
	},
	{
		id: 'w2',
		exerciseName: 'Bench Press',
		exerciseType: 'Strength',
		duration: 45,
		caloriesBurned: 250,
		date: '2026-04-02',
		notes: '3 sets x 10 reps',
		status: 'Completed',
	},
	{
		id: 'w3',
		exerciseName: 'Yoga Flow',
		exerciseType: 'Yoga',
		duration: 60,
		caloriesBurned: 200,
		date: '2026-04-03',
		notes: 'Relaxing session',
		status: 'Completed',
	},
	{
		id: 'w4',
		exerciseName: 'HIIT Circuit',
		exerciseType: 'HIIT',
		duration: 25,
		caloriesBurned: 350,
		date: '2026-04-05',
		notes: 'Intense!',
		status: 'Completed',
	},
	{
		id: 'w5',
		exerciseName: 'Evening Jog',
		exerciseType: 'Cardio',
		duration: 40,
		caloriesBurned: 380,
		date: '2026-04-07',
		notes: 'Park route',
		status: 'Completed',
	},
	{
		id: 'w6',
		exerciseName: 'Deadlifts',
		exerciseType: 'Strength',
		duration: 50,
		caloriesBurned: 300,
		date: '2026-04-09',
		notes: '4 sets x 8 reps',
		status: 'Completed',
	},
	{
		id: 'w7',
		exerciseName: 'Rest Day Run',
		exerciseType: 'Cardio',
		duration: 20,
		caloriesBurned: 180,
		date: '2026-04-12',
		notes: 'Light recovery',
		status: 'Missed',
	},
	{
		id: 'w8',
		exerciseName: 'Shoulder Press',
		exerciseType: 'Strength',
		duration: 40,
		caloriesBurned: 220,
		date: '2026-04-14',
		notes: '3 sets x 12 reps',
		status: 'Completed',
	},
	{
		id: 'w9',
		exerciseName: 'Power Yoga',
		exerciseType: 'Yoga',
		duration: 50,
		caloriesBurned: 250,
		date: '2026-04-16',
		notes: 'Advanced poses',
		status: 'Completed',
	},
	{
		id: 'w10',
		exerciseName: 'Sprint Intervals',
		exerciseType: 'HIIT',
		duration: 20,
		caloriesBurned: 320,
		date: '2026-04-19',
		notes: '10x 30s sprints',
		status: 'Completed',
	},
	{
		id: 'w11',
		exerciseName: 'Cycling',
		exerciseType: 'Cardio',
		duration: 60,
		caloriesBurned: 500,
		date: '2026-04-22',
		notes: 'Outdoor ride',
		status: 'Completed',
	},
	{
		id: 'w12',
		exerciseName: 'Squats & Lunges',
		exerciseType: 'Strength',
		duration: 45,
		caloriesBurned: 280,
		date: '2026-04-25',
		notes: 'Leg day',
		status: 'Completed',
	},
];

const seedHealthLogs: FitnessHealth.HealthLog[] = [
	{ id: 'h1', date: '2026-03-01', weight: 78, height: 175, bmi: 25.47, heartRate: 72, sleepHours: 7 },
	{ id: 'h2', date: '2026-03-10', weight: 77.5, height: 175, bmi: 25.31, heartRate: 70, sleepHours: 7.5 },
	{ id: 'h3', date: '2026-03-20', weight: 77, height: 175, bmi: 25.14, heartRate: 68, sleepHours: 8 },
	{ id: 'h4', date: '2026-04-01', weight: 76.5, height: 175, bmi: 24.98, heartRate: 69, sleepHours: 7 },
	{ id: 'h5', date: '2026-04-08', weight: 76, height: 175, bmi: 24.82, heartRate: 67, sleepHours: 7.5 },
	{ id: 'h6', date: '2026-04-15', weight: 75.5, height: 175, bmi: 24.65, heartRate: 66, sleepHours: 8 },
	{ id: 'h7', date: '2026-04-22', weight: 75, height: 175, bmi: 24.49, heartRate: 65, sleepHours: 7.5 },
	{ id: 'h8', date: '2026-04-29', weight: 74.5, height: 175, bmi: 24.33, heartRate: 64, sleepHours: 8 },
];

const seedGoals: FitnessHealth.Goal[] = [
	{
		id: 'g1',
		name: 'Lose 5kg',
		type: 'Weight Loss',
		status: 'In Progress',
		target: 5,
		current: 3.5,
		unit: 'kg',
		deadline: '2026-06-30',
		createdAt: '2026-03-01',
	},
	{
		id: 'g2',
		name: 'Run 100km this month',
		type: 'Endurance',
		status: 'In Progress',
		target: 100,
		current: 65,
		unit: 'km',
		deadline: '2026-04-30',
		createdAt: '2026-04-01',
	},
	{
		id: 'g3',
		name: 'Bench Press 80kg',
		type: 'Muscle Gain',
		status: 'Achieved',
		target: 80,
		current: 80,
		unit: 'kg',
		deadline: '2026-04-15',
		createdAt: '2026-02-01',
	},
	{
		id: 'g4',
		name: 'Touch Toes Stretch',
		type: 'Flexibility',
		status: 'Cancelled',
		target: 30,
		current: 15,
		unit: 'days',
		deadline: '2026-03-31',
		createdAt: '2026-03-01',
	},
	{
		id: 'g5',
		name: 'Workout 20 days',
		type: 'General',
		status: 'In Progress',
		target: 20,
		current: 12,
		unit: 'days',
		deadline: '2026-04-30',
		createdAt: '2026-04-01',
	},
];

const seedExercises: FitnessHealth.Exercise[] = [
	{
		id: 'e1',
		name: 'Push-ups',
		muscleGroup: 'Chest',
		difficulty: 'Easy',
		description: 'Classic bodyweight chest exercise',
		instructions:
			'Start in a plank position. Lower your body until your chest nearly touches the floor. Push back up to the starting position. Keep your core tight throughout.',
		avgCaloriesPerHour: 400,
	},
	{
		id: 'e2',
		name: 'Bench Press',
		muscleGroup: 'Chest',
		difficulty: 'Medium',
		description: 'Barbell chest press on a flat bench',
		instructions:
			'Lie on a flat bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your chest, then press it back up. Keep feet flat on the floor.',
		avgCaloriesPerHour: 350,
	},
	{
		id: 'e3',
		name: 'Pull-ups',
		muscleGroup: 'Back',
		difficulty: 'Hard',
		description: 'Upper body pulling exercise using a bar',
		instructions:
			'Hang from a bar with palms facing away. Pull yourself up until your chin is above the bar. Lower slowly back to the starting position.',
		avgCaloriesPerHour: 450,
	},
	{
		id: 'e4',
		name: 'Deadlift',
		muscleGroup: 'Back',
		difficulty: 'Hard',
		description: 'Compound lift targeting posterior chain',
		instructions:
			'Stand with feet hip-width apart. Bend at hips and knees to grip the barbell. Drive through your heels to stand up. Keep your back straight throughout.',
		avgCaloriesPerHour: 500,
	},
	{
		id: 'e5',
		name: 'Squats',
		muscleGroup: 'Legs',
		difficulty: 'Medium',
		description: 'Fundamental lower body exercise',
		instructions:
			'Stand with feet shoulder-width apart. Lower your body as if sitting in a chair. Keep your knees behind your toes. Push through your heels to stand back up.',
		avgCaloriesPerHour: 400,
	},
	{
		id: 'e6',
		name: 'Lunges',
		muscleGroup: 'Legs',
		difficulty: 'Easy',
		description: 'Single-leg lower body exercise',
		instructions:
			'Step forward with one leg. Lower your back knee toward the floor. Push back to the starting position. Alternate legs.',
		avgCaloriesPerHour: 350,
	},
	{
		id: 'e7',
		name: 'Bicep Curls',
		muscleGroup: 'Arms',
		difficulty: 'Easy',
		description: 'Isolation exercise for biceps',
		instructions:
			'Hold dumbbells at your sides with palms facing forward. Curl the weights up to shoulder level. Lower slowly. Keep elbows close to your body.',
		avgCaloriesPerHour: 250,
	},
	{
		id: 'e8',
		name: 'Overhead Press',
		muscleGroup: 'Shoulders',
		difficulty: 'Medium',
		description: 'Compound shoulder press movement',
		instructions:
			'Stand with barbell at shoulder height. Press the weight overhead until arms are fully extended. Lower back to shoulder height with control.',
		avgCaloriesPerHour: 350,
	},
	{
		id: 'e9',
		name: 'Plank',
		muscleGroup: 'Core',
		difficulty: 'Easy',
		description: 'Isometric core strengthening exercise',
		instructions:
			'Hold a push-up position with your forearms on the ground. Keep your body in a straight line from head to heels. Engage your core and hold.',
		avgCaloriesPerHour: 200,
	},
	{
		id: 'e10',
		name: 'Burpees',
		muscleGroup: 'Full Body',
		difficulty: 'Hard',
		description: 'Full body high-intensity exercise',
		instructions:
			'Start standing, drop into a squat with hands on the floor. Kick feet back into a plank. Do a push-up. Jump feet back to hands. Jump up with arms overhead.',
		avgCaloriesPerHour: 600,
	},
	{
		id: 'e11',
		name: 'Mountain Climbers',
		muscleGroup: 'Core',
		difficulty: 'Medium',
		description: 'Dynamic core and cardio exercise',
		instructions:
			'Start in a plank position. Alternate driving your knees toward your chest in a running motion. Keep your hips level and core engaged.',
		avgCaloriesPerHour: 500,
	},
	{
		id: 'e12',
		name: 'Lateral Raises',
		muscleGroup: 'Shoulders',
		difficulty: 'Easy',
		description: 'Isolation exercise for shoulder deltoids',
		instructions:
			'Stand with dumbbells at your sides. Raise arms out to the sides until parallel with the floor. Lower slowly with control.',
		avgCaloriesPerHour: 250,
	},
];

export const getWorkouts = (): FitnessHealth.Workout[] => {
	const raw = localStorage.getItem(STORAGE_KEYS.workouts);
	return raw ? JSON.parse(raw) : [];
};
export const saveWorkouts = (data: FitnessHealth.Workout[]) => {
	localStorage.setItem(STORAGE_KEYS.workouts, JSON.stringify(data));
};

export const getHealthLogs = (): FitnessHealth.HealthLog[] => {
	const raw = localStorage.getItem(STORAGE_KEYS.healthLogs);
	return raw ? JSON.parse(raw) : [];
};
export const saveHealthLogs = (data: FitnessHealth.HealthLog[]) => {
	localStorage.setItem(STORAGE_KEYS.healthLogs, JSON.stringify(data));
};

export const getGoals = (): FitnessHealth.Goal[] => {
	const raw = localStorage.getItem(STORAGE_KEYS.goals);
	return raw ? JSON.parse(raw) : [];
};
export const saveGoals = (data: FitnessHealth.Goal[]) => {
	localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(data));
};

export const getExercises = (): FitnessHealth.Exercise[] => {
	const raw = localStorage.getItem(STORAGE_KEYS.exercises);
	return raw ? JSON.parse(raw) : [];
};
export const saveExercises = (data: FitnessHealth.Exercise[]) => {
	localStorage.setItem(STORAGE_KEYS.exercises, JSON.stringify(data));
};

export const initFitnessHealthMockData = () => {
	if (!localStorage.getItem(STORAGE_KEYS.workouts)) {
		localStorage.setItem(STORAGE_KEYS.workouts, JSON.stringify(seedWorkouts));
	}
	if (!localStorage.getItem(STORAGE_KEYS.healthLogs)) {
		localStorage.setItem(STORAGE_KEYS.healthLogs, JSON.stringify(seedHealthLogs));
	}
	if (!localStorage.getItem(STORAGE_KEYS.goals)) {
		localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(seedGoals));
	}
	if (!localStorage.getItem(STORAGE_KEYS.exercises)) {
		localStorage.setItem(STORAGE_KEYS.exercises, JSON.stringify(seedExercises));
	}
};
