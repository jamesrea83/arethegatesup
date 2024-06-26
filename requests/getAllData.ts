import getArrivalsHMD from '@/requests/getArrivalsHMD';
import getFlyThroughEBNArrivals from '@/requests/getFlyThroughEBNArrivals';
import getFlyThroughEBNDepartures from '@/requests/getFlyThroughEBNDepartures';
import { TrainService } from '@/types/TrainService';
import addMinutes from '@/utils/addMinutes';
import subtractMinutes from '@/utils/subtractMinutes';
import getTimeStampFromString from '@/utils/getTimeStampFromString';
import getMinsTilEstimate from '@/utils/getMinsTilEstimate';

export default async function getAllData() {
	const arrivalsHMD = await getArrivalsHMD();
	const arrivalsEBN = await getFlyThroughEBNArrivals();
	const departuresEBN = await getFlyThroughEBNDepartures();

	const filteredArrivalsHMD = arrivalsHMD.filter(
		(trainService: TrainService) => !trainService?.isCancelled
	);

	const flyThroughEBNArrivals = arrivalsEBN.filter(
		(trainService: TrainService) => {
			const { previousCallingPoints, isCancelled } = trainService;
			if (!previousCallingPoints) return false;
			if (isCancelled) return false;
			const callingPoints = previousCallingPoints[0]?.callingPoint;
			const prevStop = callingPoints[callingPoints.length - 1];

			if (!prevStop || prevStop.crs === 'HMD') return false;
			return true;
		}
	);

	const flyThroughEBNDepartures = departuresEBN.filter(
		(trainService: TrainService) => {
			const { subsequentCallingPoints, isCancelled } = trainService;
			if (!subsequentCallingPoints) return false;
			if (isCancelled) return false;
			const nextStop = subsequentCallingPoints[0]?.callingPoint[0];
			if (!nextStop || nextStop.crs === 'HMD') return false;
			return true;
		}
	);

	const estimatedArrivalsHMD =
		filteredArrivalsHMD &&
		filteredArrivalsHMD.map((trainService: TrainService) => {
			const { sta, eta } = trainService;
			if (!sta || !eta) return trainService;
			const arrival = eta === 'On time' ? sta : eta;
			const dateObject = getTimeStampFromString(arrival);
			const estimate = subtractMinutes(dateObject, 3);
			trainService.crossingTrigger = estimate;
			const minsTilEstimate = getMinsTilEstimate(
				trainService.generatedAt,
				estimate
			);
			trainService.minsTilEstimate = minsTilEstimate;
			return trainService;
		});

	const estimatedFlyThroughEBNArrivals =
		flyThroughEBNArrivals &&
		flyThroughEBNArrivals.map((trainService: TrainService) => {
			const { sta, eta } = trainService;
			if (!sta || !eta) return trainService;
			const arrival = eta === 'On time' ? sta : eta;
			const dateObject = getTimeStampFromString(arrival);
			const estimate = subtractMinutes(dateObject, 6);
			trainService.crossingTrigger = estimate;
			const minsTilEstimate = getMinsTilEstimate(
				trainService.generatedAt,
				estimate
			);
			trainService.minsTilEstimate = minsTilEstimate;
			return trainService;
		});

	const estimatedFlyThroughEBNDepartures =
		flyThroughEBNDepartures &&
		flyThroughEBNDepartures.map((trainService: TrainService) => {
			const { std, etd } = trainService;
			if (!std || !etd) return trainService;
			const arrival = etd === 'On time' ? std : etd;
			const dateObject = getTimeStampFromString(arrival);
			const estimate = addMinutes(dateObject, 6);
			trainService.crossingTrigger = estimate;
			const minsTilEstimate = getMinsTilEstimate(
				trainService.generatedAt,
				estimate
			);
			trainService.minsTilEstimate = minsTilEstimate;
			return trainService;
		});

	const consolidated = [
		...estimatedArrivalsHMD,
		...estimatedFlyThroughEBNArrivals,
		...estimatedFlyThroughEBNDepartures,
	].sort((a: TrainService, b: TrainService) => {
		if (!a.crossingTrigger || !b.crossingTrigger) return 0;
		if (a.crossingTrigger < b.crossingTrigger) return -1;
		if (a.crossingTrigger > b.crossingTrigger) return 1;
		return 0;
	});

	return consolidated;
}
