export interface GatesEstimates {
	gatesDown: Date;
	gatesUp: Date;
	lastGatesUp?: Date;
	gatesDownDuration: number;
	timeSinceLast?: number;
}
