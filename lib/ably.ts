import * as Ably from 'ably'

export const ablyClient = new Ably.Realtime({ key: process.env.ABLY_API_KEY });
