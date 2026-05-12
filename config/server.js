module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', [
      'testKey1',
      'testKey2',
      'testKey3',
      'testKey4',
    ]),
  },
  api: {
    rest: {
      prefix: '/api',
      defaultLimit: 25,
      maxLimit: 100,
    },
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'your-admin-secret'),
    },
  },
});
