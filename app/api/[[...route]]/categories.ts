import { Hono } from 'hono';
import { and, eq, inArray } from 'drizzle-orm';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { categories, insertCategorySchema } from '@/db/schema';

const app = new Hono()
	.get('/', clerkMiddleware(), async ctx => {
		const auth = getAuth(ctx);

		if (!auth?.userId) {
			throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
		}

		const data = await db
			.select({ id: categories.id, name: categories.name })
			.from(categories)
			.where(eq(categories.userId, auth.userId));
		return ctx.json({ data });
	})
	.post(
		'/',
		clerkMiddleware(),
		zValidator('json', insertCategorySchema.pick({ name: true })),
		async ctx => {
			const auth = getAuth(ctx);

			if (!auth?.userId) {
				throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
			}

			const values = ctx.req.valid('json');

			const [newCategory] = await db
				.insert(categories)
				.values({ userId: auth.userId, ...values })
				.returning();

			return ctx.json({ data: newCategory }, 201);
		},
	)
	.post(
		'/bulk-delete',
		clerkMiddleware(),
		zValidator('json', z.object({ ids: z.array(z.number().int().positive()) })),
		async ctx => {
			const auth = getAuth(ctx);

			if (!auth?.userId) {
				throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
			}

			const values = ctx.req.valid('json');

			const data = await db
				.delete(categories)
				.where(
					and(eq(categories.userId, auth.userId), inArray(categories.id, values.ids)),
				)
				.returning({ id: categories.id });

			return ctx.json({ data });
		},
	);

export default app;
