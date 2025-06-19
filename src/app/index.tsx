import App from '@/app/app';
import HelpPage from '@/app/modules/help/page';
import HelpPagePhysical from '@/app/modules/help/pagePhysical';
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
	{
		path: '/help/physical',
		element: <HelpPagePhysical />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<SyncContextProvider>
			{/* Add the same background to the full app */}
			<div
				className='noisyBackground'
				style={{
					backgroundColor: 'var(--background-for-noise)',
					overflow: 'auto',
					minHeight: '100vh',
				}}
			>
				<RouterProvider router={router} />
			</div>
		</SyncContextProvider>
	</React.StrictMode>,
);
