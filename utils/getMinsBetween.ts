const getMinsBetween = (start: Date, end: Date) => {
	const msDifference = start.getTime() - end.getTime();
	const result = Math.round(msDifference / (1000 * 60));
	return result;
};

export default getMinsBetween;
