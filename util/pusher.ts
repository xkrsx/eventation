import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new PusherServer({
  // TODO FIX replace hardcoded with process.env
  appId: '1837328',
  key: '9562f661bd0cb577f7e9',
  secret: '520c45f061a4d7c64eef',
  // appId: process.env.PUSHER_APP_ID as string,
  // key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  // secret: process.env.PUSHER_APP_SECRET as string,
  cluster: 'eu',
  useTLS: true,
});

export const pusherClient = new PusherClient(
  '9562f661bd0cb577f7e9',
  // process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  {
    cluster: 'eu',
    auth: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  },
);

export function toPusherKey(key: string) {
  return key.replace(/:/g, '__');
}
