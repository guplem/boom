import App from '@/app/app';
import HelpPage from '@/app/modules/help/page';
import '@/app/styles/colors.css';
import '@/app/styles/components.css';
import '@/app/styles/flex.css';
import '@/app/styles/typography.css';
import { SyncContextProvider } from '@robojs/sync';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

// https://youtu.be/c02YoWR9gSY?si=yAd86a2OJSuC4cpz
// eslint-disable-next-line @typescript-eslint/typedef
const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/help',
		element: <HelpPage />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<SyncContextProvider>
			<RouterProvider router={router} />
		</SyncContextProvider>
	</React.StrictMode>,
);
