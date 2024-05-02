import getTimeStampFromString from '@/utils/getTimeStampFromString';

const getMinsTilEstimate = (generatedAt: string, estimateDateObject: Date) => {
	const generatedAtDateObject = getTimeStampFromString(generatedAt);
	// const localised = generatedAtDateObject
	// 	.toLocaleString('en-GB', { timeZone: 'Europe/London' })
	// 	.slice(11, 17);
	// const localisedDateObject = getTimeStampFromString(localised);
	const msDifference =
		estimateDateObject.getTime() - generatedAtDateObject.getTime();
	const result = Math.round(msDifference / (1000 * 60));
	// console.log('*** getMinsTilEstimate');
	// console.log('generatedAt', generatedAt);
	// console.log('localised', localised);
	// console.log('generatedAtDateObject', generatedAtDateObject);
	// console.log('localisedDateObject', localisedDateObject);
	// console.log('estimateDateObject', estimateDateObject);
	// console.log('msDifference', msDifference);
	// console.log('result', result);
	// console.log('*** /getMinsTilEstimate');
	return result;
};

export default getMinsTilEstimate;
