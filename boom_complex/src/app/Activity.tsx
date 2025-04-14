import { Profile } from '@/components/Profile'
import { useSyncState } from '@robojs/sync'
import { useEffect, useRef, useState } from 'react'
import { useDiscordSdk } from '../hooks/useDiscordSdk'

/**
 * This is your Discord Activity's main component. Customize it as you like!
 *
 * Learn more:
 * https://robojs.dev/discord-activities
 */
export const Activity = () => {
	const { authenticated, discordSdk, status } = useDiscordSdk()
	const [channelName, setChannelName] = useState<string>()
	const [isPlaying, setPlaying] = useSyncState<boolean>(false, ['video', discordSdk.channelId])
	const videoPlayer = useRef<HTMLVideoElement>(null)

	const onPause = (): void => {
		if (isPlaying) {
			setPlaying(false)
		}
	}
	const onPlay = (): void => {
		if (!isPlaying) {
			setPlaying(true)
		}
	}

	useEffect(() => {
		// Requesting the channel in GDMs (when the guild ID is null) requires
		// the dm_channels.read scope which requires Discord approval.
		if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
			if (!authenticated) setChannelName('Unable to get channel: not authenticated')
			else if (!discordSdk.channelId) setChannelName('Unable to get channel: no channel id')
			else if (!discordSdk.guildId) setChannelName('Unable to get channel: no guild id')
			return
		}

		// Collect channel info over RPC
		// Enable authentication to see it! (App.tsx)
		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
			if (channel.name) {
				setChannelName(channel.name)
			} else {
				setChannelName('Unknown Channel name')
			}
		})
	}, [authenticated, discordSdk])

	useEffect(() => {
		if (isPlaying) {
			videoPlayer.current?.play()
		} else if (!isPlaying) {
			videoPlayer.current?.pause()
		}
	}, [isPlaying])

	return (
		<div>
			<Profile />
			{channelName ? <h3>{channelName}</h3> : <h3>channel name</h3>}
			<p>status: {status}</p>
			<p>channel id: {discordSdk.channelId}</p>
			<p>guild id: {discordSdk.guildId}</p>
			<video ref={videoPlayer} className="video" src="/sample.mp4" controls={false} loop />
			<br />
			<button onClick={isPlaying ? onPause : onPlay}>{isPlaying ? 'Pause' : 'Play'}</button>
		</div>
	)
}
