import App from '@/app/app';
import '@/app/styles/colors.css';
import '@/app/styles/components.css';
import '@/app/styles/flex.css';
import '@/app/styles/typography.css';
import { SyncContextProvider } from '@robojs/sync';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<SyncContextProvider>
			<App />
		</SyncContextProvider>
	</React.StrictMode>,
);
