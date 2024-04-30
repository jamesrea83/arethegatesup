import { CallingPoint } from '@/types/CallingPoint';

export interface PreviousCallingPoints {
	callingPoint: CallingPoint[];
	serviceType: string;
	serviceChangeRequired: boolean;
	assocIsCancelled: boolean;
}
