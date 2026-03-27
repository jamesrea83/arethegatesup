import Link from 'next/link';

export default function Footer() {
	return (
		<>
			<p className='text-xs'>v1.0.0</p>
			<p className='pb-4 text-sm'>
				<Link
					href='https://www.linkedin.com/in/jamesrea83/'
					className='font-medium text-blue-600 dark:text-blue-500 hover:underline z-10 py-4'
				>
					© James Rea 2026
				</Link>
			</p>
		</>
	);
}
