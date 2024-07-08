import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from 'hono/http-exception';

import { db } from '@/db/drizzle';
import { categories } from '@/db/schema';

const app = new Hono().get('/', clerkMiddleware(), async ctx => {
	const auth = getAuth(ctx);

	if (!auth?.userId) {
		throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
	}

	const data = await db
		.select({ id: categories.id, name: categories.name })
		.from(categories)
		.where(eq(categories.userId, auth.userId));
	return ctx.json({ data });
});

export default app;
