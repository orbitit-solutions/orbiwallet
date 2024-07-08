import { accountHandlers } from './domains/accounts';
import { categoryHandlers } from './domains/categories';

export const handlers = [...accountHandlers, ...categoryHandlers];
