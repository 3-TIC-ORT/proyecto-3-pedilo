import * as Ably from 'ably'

export const ablyClient = new Ably.Rest({ key: process.env.ABLY_API_KEY });
