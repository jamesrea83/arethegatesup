const getTimeStampFromString = (timeString: string) => {
	const timeArr = timeString.split(':');
	const dateObject = new Date();
	dateObject.setHours(Number(timeArr[0]));
	dateObject.setMinutes(Number(timeArr[1]));
	return dateObject;
};

export default getTimeStampFromString;
