import getArrivalsHMD from '@/requests/getArrivalsHMD';
import getFlyThroughEBNArrivals from '@/requests/getFlyThroughEBNArrivals';
import getFlyThroughEBNDepartures from '@/requests/getFlyThroughEBNDepartures';
import { TrainService } from '@/types/TrainService';
import { GatesEstimates } from '@/types/GatesEstimates';
import getMinsBetween from '@/utils/getMinsBetween';

export default async function getProcessedData() {
	const arrivalsHMD = await getArrivalsHMD();
	const arrivalsEBN = await getFlyThroughEBNArrivals();
	const departuresEBN = await getFlyThroughEBNDepartures();

	let upDownData = [...arrivalsHMD, ...arrivalsEBN, ...departuresEBN]
		.map((trainService: TrainService) => {
			const { gatesEstimates } = trainService;
			if (!gatesEstimates) return;
			const { gatesDown, gatesUp, gatesDownDuration } = gatesEstimates;
			return { gatesDown, gatesUp, gatesDownDuration };
		})
		.sort((a, b) => {
			if (!a || !b) return 0;
			if (!a.gatesDown || !b.gatesDown) return 0;
			if (a.gatesDown < b.gatesDown) return -1;
			if (a.gatesDown > b.gatesDown) return 1;
			return 0;
		});

	const timingsData: GatesEstimates[] = [];
	upDownData.forEach(gatesEstimate => {
		if (!gatesEstimate) return;
		if (!timingsData.length) {
			timingsData.push(gatesEstimate);
			return;
		}
		const prevTrain = timingsData[timingsData.length - 1];
		const timeSinceLast = getMinsBetween(
			gatesEstimate.gatesDown,
			prevTrain.gatesUp
		);
		const data: GatesEstimates = { ...gatesEstimate };
		data.timeSinceLast = timeSinceLast;
		data.lastGatesUp = timingsData[timingsData.length - 1].gatesUp;
		if (gatesEstimate.gatesDown <= prevTrain.gatesUp) {
			timingsData[timingsData.length - 1].gatesUp = gatesEstimate.gatesUp;
			timingsData[timingsData.length - 1].gatesDownDuration =
				getMinsBetween(
					gatesEstimate.gatesUp,
					timingsData[timingsData.length - 1].gatesDown
				);
			return;
		}
		timingsData.push(data);
	});

	return timingsData;
}
