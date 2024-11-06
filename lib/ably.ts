import * as Ably from 'ably'

export const ablyClient = new Ably.Realtimet({ key: process.env.ABLY_API_KEY });
