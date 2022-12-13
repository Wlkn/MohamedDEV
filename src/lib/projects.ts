import emojiRegex from 'emoji-regex';

import type { Project, ProjectPost } from '~/types';

export async function fetchProjects(): Promise<Array<Project> | null> {
	// for (const source of projectSrcs as Array<ProjectSrc>) {
	// 	projects.push(...(await fetchRepos(source)));
	// }

	const { default: rawProjectPosts } = await import('~/data/projects.json');
	const projectPosts = rawProjectPosts as unknown as Array<ProjectPost>;
	const projects: Array<ProjectPost> = projectPosts;

	return projects
		.map((projectPosts) => {
			if (!projectPosts.topics.includes('portfolio')) return null;

			if (projectPosts.archived) return null;
			if (projectPosts.fork) return null;

			// Strip the emoji suffix from the projectPosts description
			const trimmedDescription = (projectPosts.description || '').split(' ');
			trimmedDescription.shift();
			const description = trimmedDescription.join(' ');

			return {
				description,
				icon: ((): string => {
					if (!projectPosts.description) return undefined;

					const char = projectPosts.description.split(' ')[0];

					return emojiRegex().test(char) ? char : undefined;
				})(),
				homepage: projectPosts.homepage ?? undefined,
				name: projectPosts.name,
				post: projectPosts ? `/blog/${projectPosts.post}` : undefined,
				template: false,
				url: projectPosts.html_url.toLowerCase(),
			} as Project;
		})
		.filter((project) => project !== null);
}
