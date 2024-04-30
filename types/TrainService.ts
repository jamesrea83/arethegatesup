import { PreviousCallingPoints } from '@/types/PreviousCallingPoints';
import { Location } from '@/types/Location';

export interface TrainService {
	previousCallingPoints: PreviousCallingPoints[];
	futureCancellation: boolean;
	futureDelay: boolean;
	origin: Location[];
	destination: Location[];
	sta: string;
	eta: string;
	platform: string;
	operator: string;
	operatorCode: string;
	isCircularRoute: boolean;
	isCancelled: boolean;
	filterLocationCancelled: boolean;
	serviceType: string;
	length: number;
	detachFront: boolean;
	isReverseFormation: boolean;
	serviceID: string;
}