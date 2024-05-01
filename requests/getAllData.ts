import getArrivals from '@/requests/getArrivals';
import getDepartures from '@/requests/getDepartures';
import { TrainService } from '@/types/TrainService';

const getTimeStampFromString = (timeString: string) => {
	const timeArr = timeString.split(':');
	const dateObject = new Date();
	dateObject.setHours(Number(timeArr[0]));
	dateObject.setMinutes(Number(timeArr[1]));
	return dateObject;
};

const addMinutes = (dateObject: Date, mins: number) => {
	const ms = mins * 60000;
	const newDateObject = new Date(dateObject.getTime() + ms);
	return newDateObject;
};

const subtractMinutes = (dateObject: Date, mins: number) => {
	const ms = mins * 60000;
	const newDateObject = new Date(dateObject.getTime() - ms);
	return newDateObject;
};

export default async function getAllData() {
	const arrivalsHMD = await getArrivals('HMD');
	const arrivalsEBN = await getArrivals('EBN');
	const departuresEBN = await getDepartures('EBN');

	const flyThroughEBNArrivals = arrivalsEBN.filter(
		(trainService: TrainService) => {
			if (!trainService?.previousCallingPoints) return false;
			const callingPoints =
				trainService?.previousCallingPoints[0]?.callingPoint;
			const prevStop = callingPoints[callingPoints.length - 1];

			if (!prevStop || prevStop.crs === 'HMD') return false;
			return true;
		}
	);

	const flyThroughEBNDepartures = departuresEBN.filter(
		(trainService: TrainService) => {
			if (!trainService?.subsequentCallingPoints) return false;
			const nextStop =
				trainService?.subsequentCallingPoints[0]?.callingPoint[0];
			if (!nextStop || nextStop.crs === 'HMD') return false;
			return true;
		}
	);

	const estimatedArrivalsHMD = arrivalsHMD.map(
		(trainService: TrainService) => {
			if (!trainService.sta) return trainService;
			const dateObject = getTimeStampFromString(trainService.sta);
			const estimate = subtractMinutes(dateObject, 4);
			trainService.crossingTrigger = estimate;
			return trainService;
		}
	);

	const estimatedFlyThroughEBNArrivals = flyThroughEBNArrivals.map(
		(trainService: TrainService) => {
			if (!trainService.sta) return trainService;
			const dateObject = getTimeStampFromString(trainService.sta);
			const estimate = subtractMinutes(dateObject, 8);
			trainService.crossingTrigger = estimate;
			return trainService;
		}
	);

	const estimatedFlyThroughEBNDepartures = flyThroughEBNDepartures.map(
		(trainService: TrainService) => {
			if (!trainService.std) return trainService;
			const dateObject = getTimeStampFromString(trainService.std);
			const estimate = addMinutes(dateObject, 8);
			trainService.crossingTrigger = estimate;
			return trainService;
		}
	);

	// console.log('***************** arrivalsHMD', arrivalsHMD);

	// console.log(
	// 	'***************** flyThroughEBNArrivals',
	// 	flyThroughEBNArrivals
	// );
	// flyThroughEBNArrivals.forEach((trainService: TrainService) => {
	// 	if (!trainService?.previousCallingPoints) return false;
	// 	const callingPoints =
	// 		trainService?.previousCallingPoints[0]?.callingPoint;
	// 	const prevStop = callingPoints[callingPoints.length - 1];
	// 	console.log(
	// 		`${trainService.serviceID} prev stop: ${prevStop.locationName}`
	// 	);
	// });

	// console.log(
	// 	'***************** flyThroughEBNDepartures',
	// 	flyThroughEBNDepartures
	// );
	// flyThroughEBNDepartures.forEach((trainService: TrainService) => {
	// 	if (!trainService?.subsequentCallingPoints) return false;
	// 	console.log(
	// 		`${trainService.serviceID} next stop: ${trainService?.subsequentCallingPoints[0]?.callingPoint[0].locationName}`
	// 	);
	// });

	const consolidated = [
		...estimatedArrivalsHMD,
		...estimatedFlyThroughEBNArrivals,
		...estimatedFlyThroughEBNDepartures,
	].sort((a: TrainService, b: TrainService) => {
		// const aTime = a.sta || a.std;
		// const bTime = b.sta || b.std;
		const aTime = a.crossingTrigger;
		const bTime = b.crossingTrigger;
		if (!aTime || !bTime) return 0;

		if (aTime < bTime) return -1;
		if (aTime > bTime) return 1;
		return 0;
	});

	return consolidated;
}
