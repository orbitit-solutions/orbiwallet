import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

import { mockServer } from './test/mocks/server';

// Mocking window.matchMedia() since it is not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

beforeAll(() => mockServer.listen());

afterEach(() => {
	cleanup();
	mockServer.resetHandlers();
});

afterAll(() => mockServer.close());
