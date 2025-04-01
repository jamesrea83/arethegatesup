import Link from 'next/link';

export default function Footer() {
	return (
		<>
			<p className='text-xs'>v0.1.2</p>
			<p className='pb-4 text-sm'>
				<Link
					href='https://www.linkedin.com/in/jamesrea83/'
					className='font-medium text-blue-600 dark:text-blue-500 hover:underline z-10 py-4'
				>
					© James Rea 2025
				</Link>
			</p>
		</>
	);
}
