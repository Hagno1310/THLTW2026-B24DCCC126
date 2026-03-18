declare module BookingSystem {
	export interface WorkingHours {
		start: string; // HH:mm
		end: string; // HH:mm
		enabled: boolean;
	}

	export type WeeklySchedule = Record<string, WorkingHours>; // Monday, Tuesday, etc.

	export interface Employee {
		id: string;
		name: string;
		maxAppointmentsPerDay: number;
		workingSchedule: WeeklySchedule;
		avatar?: string;
	}

	export interface Service {
		id: string;
		name: string;
		price: number;
		duration: number; // minutes
	}

	export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

	export interface Appointment {
		id: string;
		customerName: string;
		customerPhone: string;
		employeeId: string;
		serviceId: string;
		date: string; // YYYY-MM-DD
		startTime: string; // HH:mm
		endTime: string; // HH:mm
		status: AppointmentStatus;
		createdAt: string;
	}

	export interface Review {
		id: string;
		appointmentId: string;
		employeeId: string;
		rating: number;
		comment: string;
		employeeReply?: string;
		createdAt: string;
	}
}
