import { useDiscordSdk } from '../hooks/useDiscordSdk'

export function Profile() {
	const { accessToken, authenticated, discordSdk, error, session, status } = useDiscordSdk()

	if (!discordSdk) return <div>No Discord SDK</div>

	if (error) {
		return <div>Error: {error}</div>
	}

	if (!authenticated) {
		return <div>Not authenticated</div>
	}

	let avatarUri: string = ``

	if (session && session.user.avatar && session.user.id) {
		avatarUri = `https://cdn.discordapp.com/avatars/${session.user.id}/${session.user.avatar}.png?size=256`
	}

	return (
		<div>
			<img src={avatarUri} alt="User Avatar" style={{ width: '128px', height: '128px', borderRadius: '50%' }} />
			<h1>Profile</h1>
			<p>Access Token: {accessToken}</p>
			<p>Status: {status}</p>
		</div>
	)
}
