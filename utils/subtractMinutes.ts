const subtractMinutes = (dateObject: Date, mins: number) => {
	const ms = mins * 60000;
	const newDateObject = new Date(dateObject.getTime() - ms);
	return newDateObject;
};

export default subtractMinutes;
