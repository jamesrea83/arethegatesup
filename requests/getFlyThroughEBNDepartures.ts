import getDepartures from '@/requests/getDepartures';
import { TrainService } from '@/types/TrainService';
import addMinutes from '@/utils/addMinutes';
import subtractMinutes from '@/utils/subtractMinutes';
import getTimeStampFromString from '@/utils/getTimeStampFromString';
import getMinsTilEstimate from '@/utils/getMinsTilEstimate';

export default async function getFlyThroughEBNDepartures() {
	const departuresEBN = await getDepartures('EBN');

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

	return flyThroughEBNDepartures.map((trainService: TrainService) => {
		const { std, etd } = trainService;
		if (!std || !etd) return trainService;
		const arrival = etd === 'On time' ? std : etd;
		const dateObject = getTimeStampFromString(arrival);

		const gatesEstimates = {
			gatesDown: addMinutes(dateObject, 6),
			gatesUp: addMinutes(dateObject, 9),
			gatesDownDuration: 6,
		};

		trainService.gatesEstimates = gatesEstimates;

		return trainService;
	});
}
