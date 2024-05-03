import getTimeStampFromString from '@/utils/getTimeStampFromString';

const getMinsTilEstimate = (generatedAt: string, estimateDateObject: Date) => {
	const generatedAtDateObject = getTimeStampFromString(generatedAt);
	const msDifference =
		estimateDateObject.getTime() - generatedAtDateObject.getTime();
	const result = Math.round(msDifference / (1000 * 60));
	return result;
};

export default getMinsTilEstimate;
