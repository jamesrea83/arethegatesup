import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
	console.log('****** Revalidating');
	revalidatePath('/');
	return NextResponse.json({ revalidated: true, now: Date.now() });
}
