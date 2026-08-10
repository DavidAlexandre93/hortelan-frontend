import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const apiUrl = (path) => `http://localhost:3001${path}`;

export const defaultHandlers = [http.get(apiUrl('/health'), () => HttpResponse.json({ status: 'ok' }))];

export const server = setupServer(...defaultHandlers);
