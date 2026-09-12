import { Queue } from 'bullmq';

export const notificationsQueue = new Queue('notifications', {
  connection: {
    url: process.env.REDIS_URL,
  },
});
