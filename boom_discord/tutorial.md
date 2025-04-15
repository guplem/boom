# Creating a Multiplayer Video Player as a Discord Activity

> Source: https://dev.to/waveplay/how-to-add-multiplayer-to-your-discord-activity-lo1 by WavePlay

In this guide, we'll create a video player that everyone in a channel can control as a **Discord Activity** using **[Robo.js](https://roboplay.dev/docs)** and **[React](https://react.dev/)**. Let's get started!

## Creating the Activity Project

First, you'll need to have **[Node.js](https://nodejs.org/)** installed and an editor like **[VS Code](https://code.visualstudio.com/)** to get started. Next, create a new **Discord Activity** project using the following command in your terminal:

```shell
npx create-robo <projectName> -k activity
```

This will spawn a new **Discord Activity** project ready to use and made easier with the **Robo.js** framework. For this guide, we'll be using **[TypeScript](https://docs.roboplay.dev/robojs/typescript)** and **[React](https://react.dev/)**. We've named our project **`teamplay`**.

![Image](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F47nrlpiadpiuo324xa6k.png)

If this is your first time making a **Discord Activity**, you'll need to create an app in the **[Discord Developer Portal](https://discord.com/developers/applications)** and get your **Client ID** and **Client Secret**.

**Need more help?** Check out **[Creating a Discord Activity in seconds with Robo.js](https://dev.to/waveplay/how-to-build-a-discord-activity-easily-with-robojs-5bng)**

## Running the Activity

Now that our project is set up, open it in your code editor and run the following command in your terminal:

```shell
npm run dev
```

This will start the Robo project in development mode, refreshing with every change in code. It will also create a free **[Cloudflare tunnel](https://www.cloudflare.com/products/tunnel/)** for testing.

![Image](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F7687z7deulo8vcdwmoj3.png)

Copy the tunnel URL and paste it into your Discord App's **URL Mappings** in the **[Discord Developer Portal](https://discord.com/developers/applications/)**. This will allow Discord to communicate with it.

![Image](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fhdznq68x51snd3o00jqi.png)

With the project running, join a voice channel in your test Discord server and click the rocket button to join a Discord Activity. You should see your activity running in Discord!

![Image](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Feu5qu7o5dyncqg444rhh.png)

## Setting Up the Video Player

We need a video file to play. You can use any video file you like, but for this guide, we'll be using a sample video you can **[download from Coverr](https://coverr.co/videos/cat-at-the-breakfast-table-hng084z6j3)**. Let's name it `sample.mp4` and place it in the `/public` folder of your new project.

![Image](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F626t217sw0p1j7vrkjq5.png)

With the video file in place, let's add a `<video>` element to our main page. Open the `Activity.tsx` file in the `/src/app` folder and replace the existing code with the following:

```tsx
import { useEffect, useRef, useState } from 'react'

export const Activity = () => {
    const [isPlaying, setPlaying] = useState(false)
    const videoPlayer = useRef<HTMLVideoElement>(null)

    const onPause = () => {
        if (isPlaying) {
            setPlaying(false)
        }
    }
    const onPlay = () => {
        if (!isPlaying) {
            setPlaying(true)
        }
    }

    useEffect(() => {
        if (isPlaying) {
            videoPlayer.current?.play()
        } else if (!isPlaying) {
            videoPlayer.current?.pause()
        }
    }, [isPlaying])

    return (
        <div>
            <img src="/rocket.png" className="logo" alt="Discord" />
            <br />
            <video ref={videoPlayer} className="video" src="/sample.mp4" controls={false} loop />
            <br />
            <button onClick={isPlaying ? onPause : onPlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
    )
}
```

Let's also adjust the video player styling a bit. Add the following CSS to the `App.css` file in the `/src/app` folder:

```css
video {
    width: 50%;
}
```

Ta-dah! We now have a video player in our Discord Activity that can be controlled by a button. Let's add some multiplayer features to it!

## Controling the Video

To allow everyone to control the video player, we'll use the **[robojs/sync](https://docs.roboplay.dev/plugins/sync)** plugin to sync the video player state across all clients in real-time. There's many ways to add multiplayer features but this is the easiest.

Run the following in your terminal:

```shell
npx robo add @robojs/sync
```

Then wrap the `Activity` component with `SyncContextProvider` in `App.tsx`:

```tsx
import { SyncContextProvider } from '@robojs/sync'
import { DiscordContextProvider } from '../hooks/useDiscordSdk'
import { Activity } from './Activity'
import './App.css'

export default function App() {
    return (
        <DiscordContextProvider>
            <SyncContextProvider>
                <Activity />
            </SyncContextProvider>
        </DiscordContextProvider>
    )
}
```

We now have a websocket-powered connection between clients! This would normally require a lot of code, but **@robojs/sync** automatically upgrades your web server to handle websockets and syncs the state for you.

If you're already familiar with React's `useState` hook, you'll feel right at home with `useSyncState`. You can use it just like React's `useState` hook, but the state will be synced across all clients in real-time. Just provide a dependency array that acts as a unique identifier for the state.

To make it multiplayer, replace the `useState` hook in `Activity.tsx` with `useSyncState` and provide a unique identifier for the state. In this case, we'll use the string `'video'`:

```tsx
import { useSyncState } from '@robojs/sync'
import { useEffect, useRef } from 'react'

export const Activity = () => {
    const [isPlaying, setPlaying] = useSyncState(false, ['video'])
    // ... rest of the code remains the same
}
```

Now, when you click the play button, everyone using your activity will see the video playing. And when you pause it, everyone will see it pause!

But wait, what if you want to sync state by channels? You can do that too! Just provide the channel ID as the second argument in `useSyncState`, which you can get from the Discord SDK.

```tsx
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import { useSyncState } from '@robojs/sync'
import { useEffect, useRef } from 'react'

export const Activity = () => {
    const { discordSdk } = useDiscordSdk()
    const [isPlaying, setPlaying] = useSyncState(false, ['video', discordSdk.channelId])
    // ... rest of the code remains the same
}
```

Now each channel has their own state! **[Invite a friend](https://support.discord.com/hc/en-us/articles/4422142836759-Activities-on-Discord#h_01GSX5T6WVXS25BCSSDW3TAGYM)** to join your **Discord Activity** and see the video player in action.

![Image](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fj4o1mdoahtpyuw5aicgj.png)

## Wasn't That Easy?

With **Robo.js** and **@robojs/sync**, adding multiplayer features to your **Discord Activity** is a breeze. You can now create interactive experiences that everyone in a channel can enjoy together! You can also add more features like volume control, seeking, and even mouse tracking using `useSyncState`! 🚀

What's more, you can use the built-in **[Flashcore Database](https://docs.roboplay.dev/robojs/flashcore)** to persist data easily or **[Explore Plugins](https://docs.roboplay.dev/plugins/directory)** to add new features with one command, such as **[AI Chatbot Features](https://docs.roboplay.dev/plugins/ai)** or **[Web Servers](https://docs.roboplay.dev/plugins/server)**. You can even **[create Discord Bots](https://docs.roboplay.dev/discord-bots/getting-started)** with it! If you're looking for something more powerful, we also have a **[Colyseus Discord Activity Template](https://docs.roboplay.dev/templates/overview#multiplayer)** for real-time multiplayer games.

Don't forget to **[join our Discord server](https://roboplay.dev/discord)** to chat with other developers, ask questions, and share your projects. We're here to help you build amazing apps with **Robo.js**! 🚀

➞ [🚀 **Community:** Join our Discord Server](https://roboplay.dev/discord)

Our very own Robo, **Sage**, is there to answer any questions about Robo.js, Discord.js, and more