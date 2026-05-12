module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', require('crypto').randomBytes(16).toString('base64')),
  },
});
