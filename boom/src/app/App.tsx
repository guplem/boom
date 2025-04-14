import { DiscordContextProvider } from '@/hooks/useDiscordSdk'
import { SyncContextProvider } from '@robojs/sync'
import { Activity } from './Activity'
import './App.css'

export default function App() {
	return (
		// Learn more: https://robojs.dev/discord-activities/authentication
		<DiscordContextProvider authenticate scope={['identify', 'guilds']} loadingScreen={<div>Loading...</div>}>
			<SyncContextProvider>
				<Activity />
			</SyncContextProvider>
		</DiscordContextProvider>
	)
}
