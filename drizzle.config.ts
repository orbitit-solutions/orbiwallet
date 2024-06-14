import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
	path:
		process.env.NODE_ENV === 'development'
			? '.env.development.local'
			: process.env.NODE_ENV === 'test'
				? '.env.test.local'
				: '.env.local',
});

export default defineConfig({
	schema: './db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
});
