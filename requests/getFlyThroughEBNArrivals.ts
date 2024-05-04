'use server';
import getArrivals from '@/requests/getArrivals';
import { TrainService } from '@/types/TrainService';
import addMinutes from '@/utils/addMinutes';
import subtractMinutes from '@/utils/subtractMinutes';
import getTimeStampFromString from '@/utils/getTimeStampFromString';
import getMinsTilEstimate from '@/utils/getMinsTilEstimate';

export default async function getFlyThroughEBNArrivals() {
	const arrivalsEBN = await getArrivals('EBN');

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

	return flyThroughEBNArrivals.map((trainService: TrainService) => {
		const { sta, eta } = trainService;
		if (!sta || !eta) return trainService;
		const arrival = eta === 'On time' ? sta : eta;
		const dateObject = getTimeStampFromString(arrival);

		const gatesEstimates = {
			gatesDown: subtractMinutes(dateObject, 6),
			gatesUp: subtractMinutes(dateObject, 3),
			gatesDownDuration: 6,
		};

		trainService.gatesEstimates = gatesEstimates;

		return trainService;
	});
}
