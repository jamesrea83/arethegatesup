const getMinsTilEstimate = (estimateDateObject: Date) => {
	const nowDateObject = new Date();
	const msDifference = estimateDateObject.getTime() - nowDateObject.getTime();
	const result = Math.round(msDifference / (1000 * 60));
	// console.log('getMinsTilEstimate', msDifference, result);
	console.log('***');
	console.log('getMinsTilEstimate estimateDateObject', estimateDateObject);
	console.log('getMinsTilEstimate nowDateObject', nowDateObject);
	console.log('***');
	return result;
};

export default getMinsTilEstimate;
