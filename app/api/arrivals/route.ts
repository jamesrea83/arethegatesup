import { NextRequest, NextResponse } from 'next/server';
import getArrivals from '@/requests/getArrivals';

export async function GET(req: NextRequest) {
	const code = req.nextUrl.searchParams.get('code');
	if (!code) return NextResponse.json({ message: 'No station code' });
	const result = await getArrivals(code);
	try {
		return NextResponse.json({ ...result });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error });
	}
}
