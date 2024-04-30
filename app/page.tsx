import Image from 'next/image';
const soapRequest = require('easy-soap-request');
var parseString = require('xml2js').parseString;
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

const xmlBody = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:typ="http://thalesgroup.com/RTTI/2013-11-28/Token/types" xmlns:ldb="http://thalesgroup.com/RTTI/2016-02-16/ldb/">
    <soap:Header>
        <typ:AccessToken>
            <typ:TokenValue>${process.env.ACCESS_TOKEN}</typ:TokenValue>
        </typ:AccessToken>
    </soap:Header>
    <soap:Body>
        <ldb:GetArrBoardWithDetailsRequest>
            <ldb:numRows>10</ldb:numRows>
            <ldb:crs>HMD</ldb:crs>
            <ldb:filterCrs></ldb:filterCrs>
            <ldb:filterType>to</ldb:filterType>
            <ldb:timeOffset>0</ldb:timeOffset>
            <ldb:timeWindow>120</ldb:timeWindow>
        </ldb:GetArrBoardWithDetailsRequest>
    </soap:Body>
</soap:Envelope>`;

interface Train {
	'lt4:sta': string;
	'lt4:eta': string;
	'lt4:platform': string;
	'lt4:serviceID': string;
}

export default async function Home() {
	const url = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb9.asmx';
	const sampleHeaders = {
		'Content-Type': 'text/xml',
		Accept: '*/*',
	};

	const { response } = await soapRequest({
		url: url,
		headers: sampleHeaders,
		xml: xmlBody,
		timeout: 10000,
	}); // Optional timeout parameter(milliseconds)
	const { headers, body, statusCode } = response;

	const parser = new XMLParser();
	let jObj = parser.parse(body);
	const data =
		jObj['soap:Envelope']['soap:Body'].GetArrBoardWithDetailsResponse
			.GetStationBoardResult['lt5:trainServices']['lt5:service'];
	// console.log(data);

	// const parsed = await parseString(body, (err, result) => {
	// 	console.log(result['soap:Body']);
	// });
	// console.log(parsed);
	// const response = await fetch(
	// 	'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb9.asmx',
	// 	{
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'text/xml',
	// 			Accept: '*/*',
	// 		},
	// 		body: 'xmlBody',
	// 		cache: 'no-cache',
	// 	}
	// );
	// const data = await response.toString();
	// console.log(response);
	// const xmlDoc = parser.parseFromString(text, 'text/xml');
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			{/* {JSON.stringify(data)} */}
			{data.map((train: Train, index: number) => {
				return (
					<div key={train['lt4:serviceID']} className='my-4'>
						<div>Scheduled - {train['lt4:sta']}</div>
						<div>ETA - {train['lt4:eta']}</div>
						<div>Platform - {train['lt4:platform']}</div>
					</div>
				);
			})}
		</main>
	);
}
