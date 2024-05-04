'use server';
import getArrivals from '@/requests/getArrivals';
import { TrainService } from '@/types/TrainService';
import addMinutes from '@/utils/addMinutes';
import subtractMinutes from '@/utils/subtractMinutes';
import getTimeStampFromString from '@/utils/getTimeStampFromString';
import getMinsTilEstimate from '@/utils/getMinsTilEstimate';

export default async function getArrivalsHMD() {
	const arrivalsHMD = await getArrivals('HMD');
	const filteredArrivalsHMD = arrivalsHMD?.filter(
		(trainService: TrainService) => !trainService?.isCancelled
	);

	return filteredArrivalsHMD?.map((trainService: TrainService) => {
		const { sta, eta } = trainService;
		if (!sta || !eta) return trainService;
		const arrival = eta === 'On time' ? sta : eta;
		const dateObject = getTimeStampFromString(arrival);

		const gatesEstimates = {
			gatesDown: subtractMinutes(dateObject, 3),
			gatesUp: addMinutes(dateObject, 3),
			gatesDownDuration: 6,
		};

		trainService.gatesEstimates = gatesEstimates;

		return trainService;
	});
}
