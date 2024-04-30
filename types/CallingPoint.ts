export interface CallingPoint {
	locationName: string;
	crs: string;
	st: string;
	at: string;
	isCancelled: boolean;
	length: number;
	detachFront: boolean;
	affectedByDiversion: boolean;
	rerouteDelay: number;
}
