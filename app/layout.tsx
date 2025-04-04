import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Hampden Park Level Crossing Tracker',
	description:
		'Check if the gates at the Hampden Park level crossing will be up before you start your journey.',
	metadataBase: new URL('https://arethegatesup.com'),
	alternates: {
		canonical: 'https://arethegatesup.com',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			{/* <body className={inter.className}>{children}</body> */}
			<body
				className={`h-full w-full p-0 bg-black text-white ${inter.className}`}
			>
				{children}
			</body>
		</html>
	);
}
