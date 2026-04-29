import { useState } from 'react';
import {
	getWorkouts,
	saveWorkouts,
	getHealthLogs,
	saveHealthLogs,
	getGoals,
	saveGoals,
	getExercises,
	saveExercises,
	genId,
} from '@/services/FitnessHealth/data';

export default () => {
	const [workouts, setWorkouts] = useState<FitnessHealth.Workout[]>([]);
	const [healthLogs, setHealthLogs] = useState<FitnessHealth.HealthLog[]>([]);
	const [goals, setGoals] = useState<FitnessHealth.Goal[]>([]);
	const [exercises, setExercises] = useState<FitnessHealth.Exercise[]>([]);
	const [loading, setLoading] = useState(false);

	// Workouts
	const loadWorkouts = () => {
		setLoading(true);
		const d = getWorkouts();
		setWorkouts(d);
		setLoading(false);
		return d;
	};
	const createWorkout = (data: Partial<FitnessHealth.Workout>) => {
		const item: FitnessHealth.Workout = {
			id: genId(),
			exerciseName: data.exerciseName ?? '',
			exerciseType: data.exerciseType ?? 'Other',
			duration: data.duration ?? 0,
			caloriesBurned: data.caloriesBurned ?? 0,
			date: data.date ?? '',
			notes: data.notes ?? '',
			status: data.status ?? 'Completed',
		};
		const next = [item, ...getWorkouts()];
		saveWorkouts(next);
		setWorkouts(next);
		return item;
	};
	const updateWorkout = (id: string, data: Partial<FitnessHealth.Workout>) => {
		const next = getWorkouts().map((w) => (w.id === id ? { ...w, ...data } : w));
		saveWorkouts(next);
		setWorkouts(next);
	};
	const deleteWorkout = (id: string) => {
		const next = getWorkouts().filter((w) => w.id !== id);
		saveWorkouts(next);
		setWorkouts(next);
	};

	// Health Logs
	const loadHealthLogs = () => {
		const d = getHealthLogs();
		setHealthLogs(d);
		return d;
	};
	const createHealthLog = (data: Partial<FitnessHealth.HealthLog>) => {
		const bmi = data.weight && data.height ? +(data.weight / (data.height / 100) ** 2).toFixed(2) : 0;
		const item: FitnessHealth.HealthLog = {
			id: genId(),
			date: data.date ?? '',
			weight: data.weight ?? 0,
			height: data.height ?? 0,
			bmi,
			heartRate: data.heartRate ?? 0,
			sleepHours: data.sleepHours ?? 0,
		};
		const next = [item, ...getHealthLogs()];
		saveHealthLogs(next);
		setHealthLogs(next);
		return item;
	};
	const updateHealthLog = (id: string, data: Partial<FitnessHealth.HealthLog>) => {
		const next = getHealthLogs().map((h) => {
			if (h.id !== id) return h;
			const merged = { ...h, ...data };
			merged.bmi = +(merged.weight / (merged.height / 100) ** 2).toFixed(2);
			return merged;
		});
		saveHealthLogs(next);
		setHealthLogs(next);
	};
	const deleteHealthLog = (id: string) => {
		const next = getHealthLogs().filter((h) => h.id !== id);
		saveHealthLogs(next);
		setHealthLogs(next);
	};

	// Goals
	const loadGoals = () => {
		const d = getGoals();
		setGoals(d);
		return d;
	};
	const createGoal = (data: Partial<FitnessHealth.Goal>) => {
		const item: FitnessHealth.Goal = {
			id: genId(),
			name: data.name ?? '',
			type: data.type ?? 'General',
			status: data.status ?? 'In Progress',
			target: data.target ?? 0,
			current: data.current ?? 0,
			unit: data.unit ?? '',
			deadline: data.deadline ?? '',
			createdAt: new Date().toISOString(),
		};
		const next = [item, ...getGoals()];
		saveGoals(next);
		setGoals(next);
		return item;
	};
	const updateGoal = (id: string, data: Partial<FitnessHealth.Goal>) => {
		const next = getGoals().map((g) => (g.id === id ? { ...g, ...data } : g));
		saveGoals(next);
		setGoals(next);
	};
	const updateGoalCurrent = (id: string, current: number) => {
		const next = getGoals().map((g) => (g.id === id ? { ...g, current } : g));
		saveGoals(next);
		setGoals(next);
	};
	const deleteGoal = (id: string) => {
		const next = getGoals().filter((g) => g.id !== id);
		saveGoals(next);
		setGoals(next);
	};

	// Exercises
	const loadExercises = () => {
		const d = getExercises();
		setExercises(d);
		return d;
	};
	const createExercise = (data: Partial<FitnessHealth.Exercise>) => {
		const item: FitnessHealth.Exercise = {
			id: genId(),
			name: data.name ?? '',
			muscleGroup: data.muscleGroup ?? 'Full Body',
			difficulty: data.difficulty ?? 'Medium',
			description: data.description ?? '',
			instructions: data.instructions ?? '',
			avgCaloriesPerHour: data.avgCaloriesPerHour ?? 0,
		};
		const next = [item, ...getExercises()];
		saveExercises(next);
		setExercises(next);
		return item;
	};
	const updateExercise = (id: string, data: Partial<FitnessHealth.Exercise>) => {
		const next = getExercises().map((e) => (e.id === id ? { ...e, ...data } : e));
		saveExercises(next);
		setExercises(next);
	};
	const deleteExercise = (id: string) => {
		const next = getExercises().filter((e) => e.id !== id);
		saveExercises(next);
		setExercises(next);
	};

	return {
		workouts,
		healthLogs,
		goals,
		exercises,
		loading,
		loadWorkouts,
		createWorkout,
		updateWorkout,
		deleteWorkout,
		loadHealthLogs,
		createHealthLog,
		updateHealthLog,
		deleteHealthLog,
		loadGoals,
		createGoal,
		updateGoal,
		updateGoalCurrent,
		deleteGoal,
		loadExercises,
		createExercise,
		updateExercise,
		deleteExercise,
	};
};
