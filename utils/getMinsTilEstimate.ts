import getTimeStampFromString from '@/utils/getTimeStampFromString';

const getMinsTilEstimate = (generatedAt: string, estimateDateObject: Date) => {
	const generatedAtDateObject = getTimeStampFromString(generatedAt);
	const msDifference =
		estimateDateObject.getTime() - generatedAtDateObject.getTime();
	const result = Math.round(msDifference / (1000 * 60));
	console.log('*** getMinsTilEstimate');
	console.log('generatedAt', generatedAt);
	console.log('generatedAtDateObject', generatedAtDateObject);
	console.log('estimateDateObject', estimateDateObject);
	console.log('msDifference', msDifference);
	console.log('result', result);
	console.log('*** /getMinsTilEstimate');
	return result;
};

export default getMinsTilEstimate;
