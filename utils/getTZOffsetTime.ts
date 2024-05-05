export default function getTZOffsetTime(time: Date) {
	return new Date(time.getTime() + time.getTimezoneOffset() * 60000)
		.toTimeString()
		.slice(0, 5);
}
