import { CallingPoint } from '@/types/CallingPoint';

export interface SubsequentCallingPoints {
	callingPoint: CallingPoint[];
	serviceType: string;
	serviceChangeRequired: boolean;
	assocIsCancelled: boolean;
}
