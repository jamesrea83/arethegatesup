import getDepartures from '@/requests/getDepartures';
import { TrainService } from '@/types/TrainService';
import addMinutes from '@/utils/addMinutes';
import getTimeStampFromString from '@/utils/getTimeStampFromString';

export default async function getFlyThroughEBNDepartures() {
	const departuresEBN = await getDepartures('EBN');

	const flyThroughEBNDepartures = departuresEBN.filter(
		(trainService: TrainService) => {
			const { subsequentCallingPoints, isCancelled, eta } = trainService;
			if (!subsequentCallingPoints) return false;
			if (isCancelled) return false;
			if (eta === 'Delayed') return false;
			const nextStop = subsequentCallingPoints[0]?.callingPoint[0];
			if (!nextStop || nextStop.crs === 'HMD') return false;
			return true;
		}
	);

	return flyThroughEBNDepartures.map((trainService: TrainService) => {
		const { std, etd } = trainService;
		if (!std || !etd) return trainService;
		const arrival = etd === 'On time' ? std : etd;
		const dateObject = getTimeStampFromString(arrival);

		const gatesEstimates = {
			gatesDown: addMinutes(dateObject, 2),
			gatesUp: addMinutes(dateObject, 3),
			gatesDownDuration: 1,
		};

		trainService.gatesEstimates = gatesEstimates;
		trainService.info = 'EBN Departure';

		return trainService;
	});
}
