declare module ClubManagement {
	export interface Club {
		id: string;
		avatar?: string;
		name: string;
		foundedDate: string;
		description: string;
		chairman: string;
		isActive: boolean;
	}

	export interface Registration {
		id: string;
		fullName: string;
		email: string;
		phone: string;
		gender: 'Male' | 'Female' | 'Other';
		address: string;
		strengths: string;
		clubId: string;
		reason: string;
		status: 'Pending' | 'Approved' | 'Rejected';
		notes?: string;
		history?: HistoryEntry[];
	}

	export interface HistoryEntry {
		actor: string;
		action: 'Approved' | 'Rejected' | 'Created' | 'Updated' | 'Moved';
		time: string;
		note?: string;
	}
}
