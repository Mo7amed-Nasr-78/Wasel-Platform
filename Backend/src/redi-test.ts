// redis-test.ts

import Redis from 'ioredis';

const redis = new Redis({
  host: 'macrosolid-neostylish-candlelit-63367.db.redis.io',
  port: 11854,
  username: 'default',
  password: 'ZlpkFuJL757b55mYkIuYCgMiRua6rmLn',

  tls: {},

  connectTimeout: 10000,
});

redis.on('connect', () => {
  console.log('✅ TCP connection established');
});

redis.on('ready', () => {
  console.log('✅ Redis is READY');
});

redis.on('error', (err) => {
  console.error('❌ Redis ERROR:', err);
});

redis.on('close', () => {
  console.log('Redis connection closed');
});

async function test() {
  try {
    const result = await redis.ping();

    console.log('PING:', result);

    await redis.quit();
  } catch (error) {
    console.error('❌ PING FAILED:', error);
  }
}

// test();
