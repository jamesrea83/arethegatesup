const getMinsTilEstimate = (estimateDateObject: Date) => {
	const nowDateObject = new Date();
	const msDifference = estimateDateObject.getTime() - nowDateObject.getTime();
	const result = Math.round(msDifference / (1000 * 60));
	console.log('getMinsTilEstimate', msDifference, result);
	return result;
};

export default getMinsTilEstimate;
