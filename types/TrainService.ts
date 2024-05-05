import { PreviousCallingPoints } from '@/types/PreviousCallingPoints';
import { SubsequentCallingPoints } from '@/types/SubsequentCallingPoints';
import { GatesEstimates } from '@/types/GatesEstimates';
import { Location } from '@/types/Location';

export interface TrainService {
	previousCallingPoints?: PreviousCallingPoints[];
	subsequentCallingPoints?: SubsequentCallingPoints[];
	futureCancellation: boolean;
	futureDelay: boolean;
	origin: Location[];
	destination: Location[];
	sta?: string;
	std?: string;
	eta?: string;
	etd?: string;
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
	crossingTrigger?: Date;
	minsTilEstimate?: number;
	generatedAt: string;
	gatesEstimates?: GatesEstimates;
	info?: string;
}
