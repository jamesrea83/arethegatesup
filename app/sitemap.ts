import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://www.arethegatesup.com/',
			lastModified: new Date(),
			changeFrequency: 'always',
			priority: 1,
		},
		{
			url: 'https://www.arethegatesup.com/verbose',
			lastModified: new Date(),
			changeFrequency: 'always',
			priority: 0.8,
		},
	];
}
