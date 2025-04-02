import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://arethegatesup.com/',
			lastModified: new Date(),
			changeFrequency: 'always',
			priority: 1,
		},
		{
			url: 'https://arethegatesup.com/verbose',
			lastModified: new Date(),
			changeFrequency: 'always',
			priority: 0.8,
		},
	];
}
