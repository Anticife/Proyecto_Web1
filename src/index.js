'use strict';

/**
 * Bootstrap function — runs once on Strapi start.
 * 
 * Automatically configures default API permissions for:
 *   - Public role:        find, findOne on property and category
 *   - Authenticated role: create, update, delete on property
 * 
 * This eliminates the need to set permissions manually in the Admin panel
 * on first deploy.
 */
module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    await setDefaultPermissions(strapi);
  },
};

async function setDefaultPermissions(strapi) {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'users-permissions',
  });

  const rolesMap = await buildRolesMap(strapi);
  if (!rolesMap) return;

  const { publicRole, authenticatedRole } = rolesMap;

  // ── Public Role Permissions ────────────────────────────────────────────────
  await grantPermissions(strapi, pluginStore, publicRole.id, [
    { action: 'api::property.property.find' },
    { action: 'api::property.property.findOne' },
    { action: 'api::category.category.find' },
    { action: 'api::category.category.findOne' },
    // Payment webhook and preference creation are public by route config,
    // but we also need to ensure the controller action is accessible:
    { action: 'api::payments.payment.createPreference' },
    { action: 'api::payments.payment.webhook' },
  ]);

  // ── Authenticated Role Permissions ────────────────────────────────────────
  await grantPermissions(strapi, pluginStore, authenticatedRole.id, [
    { action: 'api::property.property.find' },
    { action: 'api::property.property.findOne' },
    { action: 'api::property.property.create' },
    { action: 'api::property.property.update' },
    { action: 'api::property.property.delete' },
    { action: 'api::category.category.find' },
    { action: 'api::category.category.findOne' },
    { action: 'plugin::upload.content-api.upload' },
    { action: 'plugin::upload.content-api.find' },
    { action: 'plugin::upload.content-api.findOne' },
    { action: 'api::payments.payment.createPreference' },
    { action: 'api::payments.payment.webhook' },
  ]);

  strapi.log.info('✅ Default API permissions have been applied.');
}

async function buildRolesMap(strapi) {
  try {
    const roles = await strapi
      .query('plugin::users-permissions.role')
      .findMany();

    const publicRole = roles.find((r) => r.type === 'public');
    const authenticatedRole = roles.find((r) => r.type === 'authenticated');

    if (!publicRole || !authenticatedRole) {
      strapi.log.warn('⚠️  Could not find Public or Authenticated roles. Skipping permissions bootstrap.');
      return null;
    }

    return { publicRole, authenticatedRole };
  } catch (err) {
    strapi.log.error('Bootstrap: Error fetching roles', err);
    return null;
  }
}

async function grantPermissions(strapi, pluginStore, roleId, permissions) {
  for (const perm of permissions) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action: perm.action, role: roleId } });

    if (!existing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: perm.action,
          role: roleId,
          enabled: true,
        },
      });
    } else if (!existing.enabled) {
      await strapi.query('plugin::users-permissions.permission').update({
        where: { id: existing.id },
        data: { enabled: true },
      });
    }
  }
}
