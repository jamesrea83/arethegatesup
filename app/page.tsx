export const dynamic = 'force-dynamic';
// export const revalidate = 0;
import Link from 'next/link';

import getProcessedData from '@/requests/getProcessedData';
import MainPage from '@/app/Main';
import Footer from '@/app/Footer';

export default async function Home() {
	const data = await getProcessedData();
	if (!data) return <div>no data</div>;
	return (
		<div className='h-full w-full relative flex flex-col items-center p-4'>
			<h1 className='text-lg w-full'>
				Are the gates up at Hampden Park level crossing?
			</h1>
			<p className='w-full font-bold my-2'>Refresh page for fresh data</p>
			<MainPage cachedData={data} />
			<p className='py-2'>
				Disclaimer - everything here is just a guess.
			</p>
			<Link
				href='/verbose'
				className='font-medium text-blue-600 dark:text-blue-500 hover:underline z-10 py-4'
			>
				/verbose
			</Link>
			<Footer />
		</div>
	);
}
