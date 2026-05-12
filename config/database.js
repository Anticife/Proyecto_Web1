module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    // If DATABASE_URL is provided (recommended for Neon), use it. Otherwise fall back to individual vars.
    connection: env('DATABASE_URL') || {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      // Neon requires SSL; set to an object when true so node-postgres accepts it.
      ssl: env.bool('DATABASE_SSL', true) ? { rejectUnauthorized: false } : false,
    },
    debug: false,
  },
});
