import getArrivals from '@/requests/getArrivals';
import getDepartures from '@/requests/getDepartures';
import { TrainService } from '@/types/TrainService';

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
		...arrivalsHMD,
		...flyThroughEBNArrivals,
		...flyThroughEBNDepartures,
	].sort((a: TrainService, b: TrainService) => {
		const aTime = a.sta || a.std;
		const bTime = b.sta || b.std;
		if (!aTime || !bTime) return 0;

		if (aTime < bTime) return -1;
		if (aTime > bTime) return 1;
		return 0;
	});

	console.log('total services', consolidated.length);
	return consolidated;
}
