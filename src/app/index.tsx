import App from '@/app/App';
import '@/app/styles/colors.css';
import '@/app/styles/flex.css';
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
