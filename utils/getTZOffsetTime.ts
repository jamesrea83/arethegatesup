export default function getTZOffsetTime(time: Date) {
	if (!time) return;
	return new Date(time.getTime() + time.getTimezoneOffset() * 60000)
		.toTimeString()
		.slice(0, 5);
}
